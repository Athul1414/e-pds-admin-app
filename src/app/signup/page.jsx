"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
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
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
    Grid
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonAddOutlined,
    EmailOutlined,
    LockOutlined,
    PersonOutlined,
    StorefrontOutlined,
    HomeOutlined,
    PhoneOutlined,
    MyLocationOutlined,
    BadgeOutlined,
    FingerprintOutlined,
    NavigateNext,
    NavigateBefore,
    CheckCircleOutline,
    MapOutlined
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

// Dynamically import ShopMap to avoid SSR issues
const ShopMap = dynamic(() => import('./ShopMap'), {
    ssr: false,
    loading: () => <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f1f5f9', borderRadius: 3 }}><CircularProgress /></Box>
});

export default function SignupPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [locating, setLocating] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm({
        defaultValues: {
            latitude: 12.9716,
            longitude: 77.5946
        }
    });

    const router = useRouter();
    const password = watch("password");
    const lat = watch("latitude");
    const lng = watch("longitude");

    const steps = ['Shopowner', 'Shop Details'];

    const handleNext = async () => {
        const fieldsToValidate = activeStep === 0
            ? ['name', 'email', 'phoneNumber', 'aadhaarNumber', 'password', 'confirmPassword']
            : ['shopName', 'shopId', 'shopAddress', 'latitude', 'longitude'];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleGetLocation = () => {
        setLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setValue("latitude", position.coords.latitude.toFixed(6));
                    setValue("longitude", position.coords.longitude.toFixed(6));
                    setLocating(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Handled: Please pick location manually on the map.");
                    setLocating(false);
                }
            );
        } else {
            alert("Geolocation not supported");
            setLocating(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Account created successfully!");
                router.push('/login');
            } else {
                alert(result.message || "Signup failed");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <Typography variant="h5" fontWeight="700" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <PersonOutlined fontSize="large" /> Owner Information
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Please provide your personal and professional identification details.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth label="Full Name" variant="outlined"
                                {...register("name", { required: "Name is required" })}
                                error={Boolean(errors.name)} helperText={errors.name?.message}
                                slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonOutlined color="action" /></InputAdornment> } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth label="Email Address" type="email" variant="outlined"
                                {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" } })}
                                error={Boolean(errors.email)} helperText={errors.email?.message}
                                slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailOutlined color="action" /></InputAdornment> } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth label="Phone Number" variant="outlined"
                                {...register("phoneNumber", { required: "Required", pattern: { value: /^[0-9]{10}$/, message: "10 digits required" } })}
                                error={Boolean(errors.phoneNumber)} helperText={errors.phoneNumber?.message}
                                slotProps={{ input: { startAdornment: <InputAdornment position="start"><PhoneOutlined color="action" /></InputAdornment> } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth label="Aadhaar Number" variant="outlined"
                                {...register("aadhaarNumber", { required: "Required", pattern: { value: /^[0-9]{12}$/, message: "12 digits required" } })}
                                error={Boolean(errors.aadhaarNumber)} helperText={errors.aadhaarNumber?.message}
                                slotProps={{ input: { startAdornment: <InputAdornment position="start"><FingerprintOutlined color="action" /></InputAdornment> } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth label="Password" type={showPassword ? 'text' : 'password'} variant="outlined"
                                {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 characters" } })}
                                error={Boolean(errors.password)} helperText={errors.password?.message}
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start"><LockOutlined color="action" /></InputAdornment>,
                                        endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth label="Confirm Password" type="password" variant="outlined"
                                {...register("confirmPassword", { required: "Required", validate: v => v === password || "Passwords don't match" })}
                                error={Boolean(errors.confirmPassword)} helperText={errors.confirmPassword?.message}
                                slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockOutlined color="action" /></InputAdornment> } }}
                            />
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid container spacing={4}>
                        <Grid size={12}>
                            <Typography variant="h5" fontWeight="700" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <StorefrontOutlined fontSize="large" /> Shop Details
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Provide your shop's official information and specify its location on the map.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <TextField
                                fullWidth label="Shop Name" variant="outlined"
                                {...register("shopName", { required: "Shop Name is required" })}
                                error={Boolean(errors.shopName)} helperText={errors.shopName?.message}
                                slotProps={{ input: { startAdornment: <InputAdornment position="start"><StorefrontOutlined color="action" /></InputAdornment> } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth label="FPS Code / Shop ID" variant="outlined"
                                {...register("shopId", { required: "Required" })}
                                error={Boolean(errors.shopId)} helperText={errors.shopId?.message}
                                slotProps={{ input: { startAdornment: <InputAdornment position="start"><BadgeOutlined color="action" /></InputAdornment> } }}
                            />
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                fullWidth label="Shop Address" multiline rows={3} variant="outlined"
                                {...register("shopAddress", { required: "Address is required" })}
                                error={Boolean(errors.shopAddress)} helperText={errors.shopAddress?.message}
                                slotProps={{ input: { startAdornment: <InputAdornment position="start"><HomeOutlined color="action" /></InputAdornment> } }}
                            />
                        </Grid>

                        <Grid size={12}>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MapOutlined color="primary" /> Pin Shop Location
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={locating ? <CircularProgress size={16} /> : <MyLocationOutlined />}
                                    onClick={handleGetLocation}
                                    disabled={locating}
                                    sx={{ borderRadius: 10 }}
                                >
                                    Current Location
                                </Button>
                            </Box>

                            <Paper elevation={0} sx={{ border: '2px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                                <ShopMap
                                    lat={parseFloat(lat)}
                                    lng={parseFloat(lng)}
                                    onLocationSelect={(la, ln) => {
                                        setValue("latitude", la.toFixed(6));
                                        setValue("longitude", ln.toFixed(6));
                                    }}
                                />
                            </Paper>

                            <Box sx={{ mt: 2, p: 2, bgcolor: '#f1f5f9', borderRadius: 2, display: 'flex', justifyContent: 'space-around', border: '1px dashed #cbd5e1' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" color="text.secondary" display="block" uppercase fontWeight="bold">Latitude</Typography>
                                    <Typography variant="body1" fontWeight="600">{lat}</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" color="text.secondary" display="block" uppercase fontWeight="bold">Longitude</Typography>
                                    <Typography variant="body1" fontWeight="600">{lng}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            py: 6,
            px: 2
        }}>
            <Fade in={true} timeout={1000}>
                <Container maxWidth="md">
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 6,
                            overflow: 'hidden',
                            bgcolor: 'rgba(255, 255, 255, 0.98)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        {/* Improved Header */}
                        <Box sx={{ bgcolor: 'primary.main', py: 5, textAlign: 'center', color: 'white', position: 'relative' }}>
                            <Box sx={{
                                position: 'absolute',
                                top: -20,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                bgcolor: 'white',
                                color: 'primary.main',
                                p: 2,
                                borderRadius: '50%',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}>
                                <PersonAddOutlined sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: -1.5, mb: 1 }}>Sign Up</Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>Electronic Public Distribution System Portal</Typography>
                        </Box>

                        <Box sx={{ p: { xs: 4, md: 8 } }}>
                            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 8 }}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 'bold' } }}>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Box sx={{ minHeight: 480 }}>
                                    {renderStepContent(activeStep)}
                                </Box>

                                <Divider sx={{ my: 6 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button
                                        disabled={activeStep === 0 || loading}
                                        onClick={handleBack}
                                        startIcon={<NavigateBefore />}
                                        variant="text"
                                        size="large"
                                        sx={{ borderRadius: 3, px: 4, fontWeight: '700', py: 1.5 }}
                                    >
                                        Previous
                                    </Button>

                                    {activeStep === steps.length - 1 ? (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={loading}
                                            size="large"
                                            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <CheckCircleOutline />}
                                            sx={{
                                                borderRadius: 3,
                                                px: 6,
                                                py: 2,
                                                fontWeight: '900',
                                                fontSize: '1.2rem',
                                                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)'
                                            }}
                                        >
                                            {loading ? "Registering..." : "Submit Registration"}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            size="large"
                                            endIcon={<NavigateNext />}
                                            sx={{
                                                borderRadius: 3,
                                                px: 6,
                                                py: 2,
                                                fontWeight: '900',
                                                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)'
                                            }}
                                        >
                                            Next Step
                                        </Button>
                                    )}
                                </Box>

                                <Box sx={{ textAlign: 'center', mt: 6 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Already have an account? <Link href="/login" sx={{ color: 'primary.main', fontWeight: '800', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Log In</Link>
                                    </Typography>
                                </Box>
                            </form>
                        </Box>
                    </Paper>
                </Container>
            </Fade>
        </Box>
    );
}
