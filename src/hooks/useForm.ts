import { useState, useCallback, useMemo } from 'react';
import { z } from 'zod';

interface UseFormOptions<T> {
  readonly initialValues: T;
  readonly validationSchema?: z.ZodSchema<T>;
  readonly onSubmit: (values: T) => Promise<void> | void;
}

interface FormState<T> {
  readonly values: T;
  readonly errors: Partial<Record<keyof T, string>>;
  readonly isSubmitting: boolean;
  readonly isValid: boolean;
}

interface FormActions<T> {
  readonly setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  readonly setValues: (values: Partial<T>) => void;
  readonly setError: <K extends keyof T>(field: K, error: string) => void;
  readonly setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  readonly clearErrors: () => void;
  readonly reset: () => void;
  readonly handleSubmit: (e?: React.FormEvent) => Promise<void>;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>): FormState<T> & FormActions<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(() => {
    if (!validationSchema) {
      return true;
    }
    
    try {
      validationSchema.parse(values);
      return Object.keys(errors).length === 0;
    } catch {
      return false;
    }
  }, [values, errors, validationSchema]);

  const validateField = useCallback((field: keyof T, value: T[keyof T]) => {
    if (!validationSchema) {
      return;
    }

    try {
      const fieldSchema = validationSchema.shape[field as string];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [field]: error.errors[0]?.message || 'Campo inválido',
        }));
      }
    }
  }, [validationSchema]);

  const validateAll = useCallback(() => {
    if (!validationSchema) {
      return true;
    }

    try {
      validationSchema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof T;
          if (field) {
            newErrors[field] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  }, [validateField]);

  const setValuesPartial = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
    
    // Validate all changed fields
    Object.entries(newValues).forEach(([field, value]) => {
      validateField(field as keyof T, value as T[keyof T]);
    });
  }, [validateField]);

  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setErrorsPartial = useCallback((newErrors: Partial<Record<keyof T, string>>) => {
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle submission error
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit, validateAll]);

  return {
    values,
    errors,
    isSubmitting,
    isValid,
    setValue,
    setValues: setValuesPartial,
    setError,
    setErrors: setErrorsPartial,
    clearErrors,
    reset,
    handleSubmit,
  };
}