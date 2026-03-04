"use client";

import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Link,
    IconButton,
    InputAdornment,
    Divider,
    Fade,
    CircularProgress
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    LoginOutlined,
    EmailOutlined,
    LockOutlined,
    NavigateNext,
    CheckCircleOutline
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { useDispatch } from 'react-redux';
import { setUserSession } from '@/redux/authSlice';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        setLoading(true);
        setLoginError("");
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: data.email, password: data.password }),
            });

            const result = await response.json();

            if (result.status === "Success") {
                // Dispatch Redux action
                dispatch(setUserSession(result.userSession));
                // Redirect to dashboard/home after successful login
                router.push('/brands');
            } else {
                setLoginError(result.message || "Invalid Credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            setLoginError("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            overflow: 'hidden',
            bgcolor: '#ffffff',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Left Panel: Branding (Landscape Sidebar) */}
            <Box sx={{
                width: { xs: '100%', md: '35%', lg: '30%' },
                bgcolor: '#374151',
                color: 'white',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 6,
                position: 'relative',
                boxShadow: '10px 0 30px rgba(0,0,0,0.1)',
                zIndex: 10
            }}>
                <Box>
                    <Box sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 4,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <LoginOutlined sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h3" fontWeight="800" sx={{ letterSpacing: -1, mb: 2, lineHeight: 1.1 }}>
                        Merchant <br /> Login
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8, fontSize: '1.1rem', mb: 4 }}>
                        Welcome back to the E-PDS Administration Portal.
                    </Typography>
                </Box>

                <Box sx={{ pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        Authorized access only
                    </Typography>
                </Box>
            </Box>

            {/* Right Panel: Login Form */}
            <Box sx={{
                flex: 1,
                height: '100%',
                overflowY: 'auto',
                bgcolor: '#ffffff',
                p: { xs: 4, md: 8, lg: 12 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <Fade in={true} timeout={800}>
                    <Box sx={{ maxWidth: 450, width: '100%', mx: 'auto' }}>
                        {/* Mobile & Small Screen Header */}
                        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
                            <Typography variant="h4" fontWeight="800" sx={{ mb: 1, color: '#111827' }}>Login</Typography>
                            <Typography variant="body1" sx={{ color: '#6b7280' }}>Authorized access for E-PDS Management</Typography>
                        </Box>

                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" fontWeight="800" sx={{ color: '#111827', mb: 1, display: { xs: 'none', md: 'block' } }}>
                                Sign In
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#6b7280', display: { xs: 'none', md: 'block' } }}>
                                Please enter your credentials to access the admin portal.
                            </Typography>
                        </Box>

                        {loginError && (
                            <Box sx={{ mb: 3, p: 2, bgcolor: '#fee2e2', color: '#b91c1c', borderRadius: 2, border: '1px solid #f87171' }}>
                                <Typography variant="body2" fontWeight="600">{loginError}</Typography>
                            </Box>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    variant="outlined"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" }
                                    })}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email?.message}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailOutlined sx={{ color: '#6b7280' }} />
                                                </InputAdornment>
                                            ),
                                        }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: '#374151' },
                                            '&.Mui-focused fieldset': { borderColor: '#374151' }
                                        }
                                    }}
                                />

                                <Box>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        variant="outlined"
                                        {...register("password", { required: "Password is required" })}
                                        error={Boolean(errors.password)}
                                        helperText={errors.password?.message}
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockOutlined sx={{ color: '#6b7280' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': { borderColor: '#374151' },
                                                '&.Mui-focused fieldset': { borderColor: '#374151' }
                                            }
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                        <Link href="#" sx={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                            Forgot Password?
                                        </Link>
                                    </Box>
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    size="large"
                                    fullWidth
                                    startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <LoginOutlined />}
                                    sx={{
                                        borderRadius: 2,
                                        py: 2,
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        bgcolor: '#374151',
                                        '&:hover': { bgcolor: '#1f2937' },
                                        boxShadow: 'none',
                                        mt: 2
                                    }}
                                >
                                    {loading ? "Authenticating..." : "Login to Portal"}
                                </Button>
                            </Box>
                        </form>

                        <Box sx={{ textAlign: 'center', mt: 6, pt: 4, borderTop: '1px solid #e5e7eb' }}>
                            <Typography variant="body1" color="text.secondary">
                                New to the merchant portal? <br />
                                <Link href="/signup" sx={{ color: '#3b82f6', fontWeight: '800', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                    Create a merchant account
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Fade>
            </Box>
        </Box>
    );
}
