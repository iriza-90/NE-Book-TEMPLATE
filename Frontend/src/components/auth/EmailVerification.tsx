import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Mail } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

// ✅ Zod schema: only allows 6 digits (numbers only)
const verificationSchema = z.object({
  code: z
    .string()
    .length(6, { message: 'Code must be 6 digits' })
    .regex(/^\d+$/, { message: 'Code must contain only numbers' }),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

const EmailVerification = ({ onShowLogin }: { onShowLogin: () => void }) => {
  const { verifyEmail, resendVerification, isLoading, verificationEmail, clearVerificationEmail } = useAuth();
  const [showVerifyForm, setShowVerifyForm] = useState(true);

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: VerificationFormValues) => {
    await verifyEmail(data.code);
    onShowLogin(); // Redirect to login after successful verification
  };

  const handleResendCode = async () => {
    await resendVerification();
  };

  const handleGoToLogin = () => {
    clearVerificationEmail();
    onShowLogin();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Mail className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-center">
          We've sent a verification email to <strong>{verificationEmail}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showVerifyForm ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        type="tel"
                        value={field.value}
                        onChange={(val) => {
                          const numericOnly = val.replace(/\D/g, '');
                          field.onChange(numericOnly);
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </Button>
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={handleResendCode} 
                  className="w-full" 
                  disabled={isLoading}
                >
                  Resend Code
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Please check your email and click the verification link we sent you.
              If you can't find the email, check your spam folder.
            </p>
            <div className="space-y-2">
              <Button onClick={() => setShowVerifyForm(true)} className="w-full">
                Enter Verification Code
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleResendCode} 
                className="w-full" 
                disabled={isLoading}
              >
                Resend Verification Email
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already verified?{' '}
          <Button variant="link" className="p-0" onClick={handleGoToLogin}>
            Login
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default EmailVerification;
