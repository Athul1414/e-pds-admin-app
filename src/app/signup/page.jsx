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
    Grid,
    MenuItem
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
            : ['shopType', 'shopName', 'shopId', 'shopAddress', 'pincode', 'latitude', 'longitude'];

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
                            <Typography variant="h5" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, color: '#374151' }}>
                                <PersonOutlined fontSize="large" /> Owner Information
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, color: '#6b7280' }}>
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
                            <Typography variant="h5" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, color: '#374151' }}>
                                <StorefrontOutlined fontSize="large" /> Shop Details
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1, color: '#6b7280' }}>
                                Provide your shop's official information and specify its location on the map.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth label="Registration Type" variant="outlined"
                                defaultValue="Ration Shop"
                                {...register("shopType", { required: "Type is required" })}
                                error={Boolean(errors.shopType)} helperText={errors.shopType?.message}
                                slotProps={{ input: { startAdornment: <InputAdornment position="start"><StorefrontOutlined color="action" /></InputAdornment> } }}
                            >
                                <MenuItem value="Ration Shop">Ration Shop</MenuItem>
                                <MenuItem value="Supplyco">Supplyco</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth label="FPS Code / Shop ID" variant="outlined"
                                {...register("shopId", { required: "Required" })}
                                error={Boolean(errors.shopId)} helperText={errors.shopId?.message}
                                slotProps={{ input: { startAdornment: <InputAdornment position="start"><BadgeOutlined color="action" /></InputAdornment> } }}
                            />
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
                                fullWidth label="Pincode" variant="outlined"
                                {...register("pincode", { required: "Required", pattern: { value: /^[0-9]{6}$/, message: "6 digits required" } })}
                                error={Boolean(errors.pincode)} helperText={errors.pincode?.message}
                                slotProps={{ input: { startAdornment: <InputAdornment position="start"><FingerprintOutlined color="action" /></InputAdornment> } }}
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
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700, color: '#374151' }}>
                                    <MapOutlined sx={{ color: '#3b82f6' }} /> Pin Shop Location
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={locating ? <CircularProgress size={16} /> : <MyLocationOutlined />}
                                    onClick={handleGetLocation}
                                    disabled={locating}
                                    sx={{
                                        borderRadius: 2,
                                        color: '#374151',
                                        borderColor: '#e5e7eb',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': { borderColor: '#3b82f6', bgcolor: '#f9fafb' }
                                    }}
                                >
                                    Current Location
                                </Button>
                            </Box>

                            <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                                <ShopMap
                                    lat={parseFloat(lat)}
                                    lng={parseFloat(lng)}
                                    pincode={watch("pincode")}
                                    onLocationSelect={(la, ln) => {
                                        setValue("latitude", la.toFixed(6));
                                        setValue("longitude", ln.toFixed(6));
                                    }}
                                />
                            </Paper>

                            <Box sx={{ mt: 2, p: 2, bgcolor: '#f9fafb', borderRadius: 2, display: 'flex', justifyContent: 'space-around', border: '1px solid #e5e7eb' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: 800, letterSpacing: 0.5 }}>Latitude</Typography>
                                    <Typography variant="body1" fontWeight="700" sx={{ color: '#111827' }}>{lat}</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ borderColor: '#e5e7eb' }} />
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: 800, letterSpacing: 0.5 }}>Longitude</Typography>
                                    <Typography variant="body1" fontWeight="700" sx={{ color: '#111827' }}>{lng}</Typography>
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
            height: '100vh',
            display: 'flex',
            overflow: 'hidden',
            bgcolor: '#ffffff',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Left Panel: Branding & Stepper (Landscape Sidebar) */}
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
                        <PersonAddOutlined sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h3" fontWeight="800" sx={{ letterSpacing: -1, mb: 2, lineHeight: 1.1 }}>
                        Create <br /> Account
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8, fontSize: '1.1rem', mb: 8 }}>
                        Electronic Public Distribution System Portal
                    </Typography>

                    <Stepper
                        activeStep={activeStep}
                        orientation="vertical"
                        sx={{
                            '& .MuiStepIcon-root.Mui-active': { color: '#ffffff' },
                            '& .MuiStepIcon-root.Mui-completed': { color: '#10b981' },
                            '& .MuiStepLabel-label': { fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontSize: '1rem' },
                            '& .MuiStepLabel-label.Mui-active': { color: '#ffffff' },
                            '& .MuiStepConnector-line': { borderColor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Box sx={{ pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        Already have an account?
                    </Typography>
                    <Link href="/login" sx={{ color: '#60a5fa', fontWeight: '700', textDecoration: 'none', fontSize: '1.1rem', '&:hover': { textDecoration: 'underline' } }}>
                        Log In Now
                    </Link>
                </Box>
            </Box>

            {/* Right Panel: Scrollable Form */}
            <Box sx={{
                flex: 1,
                height: '100%',
                overflowY: 'auto',
                bgcolor: '#ffffff',
                p: { xs: 4, md: 8, lg: 12 },
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Fade in={true} timeout={800}>
                    <Box sx={{ maxWidth: 800, width: '100%', mx: 'auto' }}>
                        {/* Mobile Header */}
                        <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
                            <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>Sign Up</Typography>
                            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                                {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
                            </Stepper>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box sx={{ minHeight: '60vh' }}>
                                {renderStepContent(activeStep)}
                            </Box>

                            <Box sx={{
                                mt: 8,
                                pt: 4,
                                borderTop: '1px solid #e5e7eb',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Button
                                    disabled={activeStep === 0 || loading}
                                    onClick={handleBack}
                                    startIcon={<NavigateBefore />}
                                    variant="text"
                                    size="large"
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        fontWeight: '700',
                                        py: 1.5,
                                        color: '#6b7280',
                                        '&:hover': { bgcolor: '#f9fafb', color: '#111827' }
                                    }}
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
                                            borderRadius: 2,
                                            px: 6,
                                            py: 2,
                                            fontWeight: '700',
                                            fontSize: '1rem',
                                            bgcolor: '#374151',
                                            '&:hover': { bgcolor: '#1f2937' },
                                            boxShadow: 'none'
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
                                            borderRadius: 2,
                                            px: 6,
                                            py: 2,
                                            fontWeight: '700',
                                            bgcolor: '#374151',
                                            '&:hover': { bgcolor: '#1f2937' },
                                            boxShadow: 'none'
                                        }}
                                    >
                                        Next Step
                                    </Button>
                                )}
                            </Box>
                        </form>
                    </Box>
                </Fade>
            </Box>
        </Box>
    );
}
