import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '@/schemas/auth';

enum SignOperation {
  login = 'login',
  register = 'register',
}

interface AuthFormProps {
  type: SignOperation;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  errorMessage?: string;
}

type FormData = LoginFormData | RegisterFormData;

export function AuthForm({ type, onSubmit, isLoading = false, errorMessage = '' }: AuthFormProps) {
  const schema = type === SignOperation.login ? loginSchema : registerSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      ...(type === SignOperation.register && {
        confirmPassword: '',
        fullName: '',
        gender: 'MALE',
        age: 18,
      }),
    },
  });

  const onSubmitHandler = async (data: FormData) => {
    await onSubmit(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmitHandler)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {type === SignOperation.register && (
        <>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                type="text"
                disabled={isLoading}
                error={!!errors.fullName}
                helperText={(errors.fullName?.message as string) || ''}
                placeholder="John Doe"
                fullWidth
              />
            )}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>Gender</InputLabel>
                  <Select {...field} label="Gender" disabled={isLoading}>
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Age"
                  type="number"
                  disabled={isLoading}
                  error={!!errors.age}
                  helperText={(errors.age?.message as string) || ''}
                  placeholder="25"
                  slotProps={{ htmlInput: { min: 18 } }}
                  fullWidth
                />
              )}
            />
          </Box>
        </>
      )}

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            disabled={isLoading}
            error={!!errors.email}
            helperText={(errors.email?.message as string) || ''}
            placeholder="your@email.com"
            fullWidth
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Password"
            type="password"
            disabled={isLoading}
            error={!!errors.password}
            helperText={(errors.password?.message as string) || ''}
            placeholder="••••••••"
            fullWidth
          />
        )}
      />

      {type === SignOperation.register && (
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Confirm Password"
              type="password"
              disabled={isLoading}
              error={!!errors.confirmPassword}
              helperText={(errors.confirmPassword?.message as string) || ''}
              placeholder="••••••••"
              fullWidth
            />
          )}
        />
      )}

      <Button type="submit" disabled={isLoading} variant="contained" size="large" sx={{ mt: 2 }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            {type === SignOperation.login ? 'Signing in...' : 'Creating account...'}
          </div>
        ) : type === SignOperation.login ? (
          'Sign In'
        ) : (
          'Sign Up'
        )}
      </Button>
    </Box>
  );
}
