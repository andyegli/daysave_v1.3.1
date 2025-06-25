#!/bin/bash
# Create missing EJS view files for DaySave

echo "📁 Creating missing EJS view files..."

# Create views directory if it doesn't exist
mkdir -p views

# Create views/index.ejs - Landing Page
cat > views/index.ejs << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <style>
        :root {
            --primary-color: #2596be;
            --secondary-color: #a1d8c9;
            --accent-color: #fbda6a;
        }
        .hero-section {
            background: linear-gradient(135deg, var(--accent-color), var(--secondary-color), var(--primary-color));
            min-height: 100vh;
            display: flex;
            align-items: center;
            color: white;
        }
        .footer-floating {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            backdrop-filter: blur(10px);
            background-color: rgba(255, 255, 255, 0.95);
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            padding: 10px 0;
        }
    </style>
</head>
<body>
    <!-- Hero Section -->
    <div class="hero-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-4">Save Your Social Media Moments</h1>
                    <p class="lead mb-4">Organize, analyze, and share content from 11 social platforms with AI-powered insights.</p>
                    <div class="d-flex gap-3">
                        <a href="/register" class="btn btn-light btn-lg px-4 py-3 rounded-pill">
                            <i class="bi bi-star me-2"></i>Start Free Trial
                        </a>
                        <a href="/login" class="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                            Sign In
                        </a>
                    </div>
                </div>
                <div class="col-lg-6 text-center">
                    <div class="bg-white rounded-4 p-4 shadow-lg text-dark">
                        <h5 class="text-primary">✨ DaySave Dashboard</h5>
                        <div class="row text-center mt-4">
                            <div class="col-4">
                                <div class="h3 fw-bold text-primary">11</div>
                                <small>Platforms</small>
                            </div>
                            <div class="col-4">
                                <div class="h3 fw-bold text-success">AI</div>
                                <small>Powered</small>
                            </div>
                            <div class="col-4">
                                <div class="h3 fw-bold text-warning">7</div>
                                <small>Days Free</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Floating Footer -->
    <footer class="footer-floating">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <div class="d-flex align-items-center gap-4">
                        <a href="/terms" class="text-decoration-none text-muted">
                            <small>Terms of Trade</small>
                        </a>
                        <a href="/privacy" class="text-decoration-none text-muted">
                            <small>Privacy Policy</small>
                        </a>
                        <a href="/contact" class="text-decoration-none text-muted">
                            <small>Contact Us</small>
                        </a>
                    </div>
                </div>
                <div class="col-md-6 text-md-end">
                    <small class="text-muted">© 2025 DaySave</small>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
EOF

# Create views/login.ejs - Login Page
cat > views/login.ejs << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>
<body class="bg-light">
    <div class="min-vh-100 d-flex align-items-center justify-content-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                    <div class="card shadow-lg border-0 rounded-4">
                        <div class="card-body p-5">
                            <div class="text-center mb-4">
                                <h1 class="h3 fw-bold text-primary">DaySave</h1>
                                <p class="text-muted">Welcome back! Please sign in.</p>
                            </div>

                            <% if (typeof error !== 'undefined' && error) { %>
                                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <% if (error === 'oauth_not_configured') { %>
                                        OAuth not configured. Please use email/password login.
                                    <% } else if (error === 'invalid_credentials') { %>
                                        Invalid email or password.
                                    <% } else { %>
                                        Login failed. Please try again.
                                    <% } %>
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                            <% } %>

                            <!-- Social Login -->
                            <div class="d-grid gap-3 mb-4">
                                <a href="/auth/google" class="btn btn-outline-primary">
                                    <i class="bi bi-google me-2"></i>Continue with Google
                                </a>
                            </div>

                            <div class="text-center mb-4">
                                <hr class="d-inline-block" style="width: 40px;">
                                <span class="px-3 text-muted">or</span>
                                <hr class="d-inline-block" style="width: 40px;">
                            </div>

                            <!-- Email/Password Form -->
                            <form action="/auth/login" method="POST">
                                <div class="form-floating mb-3">
                                    <input type="email" class="form-control" id="email" name="email" placeholder="Email" required>
                                    <label for="email">Email</label>
                                </div>
                                <div class="form-floating mb-4">
                                    <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
                                    <label for="password">Password</label>
                                </div>
                                <button type="submit" class="btn btn-primary btn-lg w-100 mb-3">
                                    <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                                </button>
                            </form>

                            <div class="text-center">
                                <p class="text-muted mb-0">
                                    Don't have an account?
                                    <a href="/register" class="text-decoration-none fw-semibold">Sign up here</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
EOF

# Create views/register.ejs - Registration Page
cat > views/register.ejs << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>
<body class="bg-light">
    <div class="min-vh-100 d-flex align-items-center justify-content-center py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-4">
                    <div class="card shadow-lg border-0 rounded-4">
                        <div class="card-body p-5">
                            <div class="text-center mb-4">
                                <h1 class="h3 fw-bold text-primary">DaySave</h1>
                                <p class="text-muted">Create your account and start your free trial.</p>
                            </div>

                            <% if (typeof error !== 'undefined' && error) { %>
                                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <% if (error === 'user_exists') { %>
                                        An account with this email already exists.
                                    <% } else if (error === 'validation_failed') { %>
                                        Please check your input and try again.
                                    <% } else { %>
                                        Registration failed. Please try again.
                                    <% } %>
                                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                            <% } %>

                            <!-- Social Registration -->
                            <div class="d-grid gap-3 mb-4">
                                <a href="/auth/google" class="btn btn-outline-primary">
                                    <i class="bi bi-google me-2"></i>Sign up with Google
                                </a>
                            </div>

                            <div class="text-center mb-4">
                                <hr class="d-inline-block" style="width: 40px;">
                                <span class="px-3 text-muted">or</span>
                                <hr class="d-inline-block" style="width: 40px;">
                            </div>

                            <!-- Registration Form -->
                            <form action="/auth/register" method="POST">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="username" name="username" placeholder="Username" required>
                                    <label for="username">Username</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="email" class="form-control" id="email" name="email" placeholder="Email" required>
                                    <label for="email">Email</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="password" class="form-control" id="password" name="password" placeholder="Password" required minlength="8">
                                    <label for="password">Password</label>
                                    <div class="form-text">Must be 8+ characters with uppercase, lowercase, number, and symbol.</div>
                                </div>
                                <div class="form-floating mb-4">
                                    <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required>
                                    <label for="confirmPassword">Confirm Password</label>
                                </div>
                                <div class="form-check mb-4">
                                    <input class="form-check-input" type="checkbox" id="terms" name="terms" required>
                                    <label class="form-check-label" for="terms">
                                        I agree to the <a href="/terms" target="_blank">Terms</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                                    </label>
                                </div>
                                <button type="submit" class="btn btn-primary btn-lg w-100 mb-3">
                                    <i class="bi bi-person-plus me-2"></i>Create Account
                                </button>
                            </form>

                            <div class="text-center">
                                <p class="text-muted mb-0">
                                    Already have an account?
                                    <a href="/login" class="text-decoration-none fw-semibold">Sign in here</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
EOF

# Create views/dashboard.ejs - User Dashboard
cat > views/dashboard.ejs << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div class="container">
            <a class="navbar-brand fw-bold text-primary" href="/dashboard">
                <i class="bi bi-calendar-heart me-2"></i>DaySave
            </a>
            <div class="navbar-nav ms-auto">
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        <% if (user.profile_image) { %>
                            <img src="<%= user.profile_image %>" alt="Profile" width="24" height="24" class="rounded-circle me-1">
                        <% } else { %>
                            <i class="bi bi-person-circle me-1"></i>
                        <% } %>
                        <%= user.username || user.email.split('@')[0] %>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="/contacts"><i class="bi bi-person-lines-fill me-2"></i>Contacts</a></li>
                        <li><a class="dropdown-item" href="/logout"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="container py-5">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 class="h3 fw-bold mb-1">Welcome back, <%= user.username || user.email.split('@')[0] %>!</h1>
                        <p class="text-muted mb-0">Here's what's happening with your social media content today.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="row g-4 mb-4">
            <div class="col-lg-3 col-md-6">
                <div class="card border-0 bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <h6 class="card-title mb-0">Connected Accounts</h6>
                                <div class="h4 fw-bold mb-0">0</div>
                            </div>
                            <div class="text-white-50">
                                <i class="bi bi-share fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card border-0 bg-success text-white">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <h6 class="card-title mb-0">Total Content</h6>
                                <div class="h4 fw-bold mb-0">0</div>
                            </div>
                            <div class="text-white-50">
                                <i class="bi bi-collection fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card border-0 bg-warning text-white">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <h6 class="card-title mb-0">Contacts</h6>
                                <div class="h4 fw-bold mb-0">0</div>
                            </div>
                            <div class="text-white-50">
                                <i class="bi bi-people fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6">
                <div class="card border-0 bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <h6 class="card-title mb-0">Shares</h6>
                                <div class="h4 fw-bold mb-0">0</div>
                            </div>
                            <div class="text-white-50">
                                <i class="bi bi-send fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Welcome Message -->
        <div class="card">
            <div class="card-body text-center py-5">
                <h3 class="text-primary mb-3">🎉 Welcome to DaySave!</h3>
                <p class="lead">Your social media content management platform is ready.</p>
                <div class="row justify-content-center mt-4">
                    <div class="col-md-8">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <a href="/contacts" class="btn btn-outline-primary w-100 py-3">
                                    <i class="bi bi-person-lines-fill fs-1 d-block mb-2"></i>
                                    Manage Contacts
                                </a>
                            </div>
                            <div class="col-md-6">
                                <button class="btn btn-outline-secondary w-100 py-3" disabled>
                                    <i class="bi bi-share fs-1 d-block mb-2"></i>
                                    Connect Social Accounts
                                    <small class="d-block">(Coming Soon)</small>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
EOF

# Create views/error.ejs - Error Page
cat > views/error.ejs << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>
<body>
    <div class="min-vh-100 d-flex align-items-center justify-content-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6 text-center">
                    <div class="mb-5">
                        <i class="bi bi-exclamation-circle text-danger" style="font-size: 6rem;"></i>
                    </div>
                    <h1 class="display-4 fw-bold text-danger">Oops!</h1>
                    <h2 class="mb-4">Something went wrong</h2>
                    <p class="lead text-muted mb-5">
                        We're experiencing some technical difficulties. Please try again later.
                    </p>
                    
                    <% if (typeof error !== 'undefined' && error && process.env.NODE_ENV === 'development') { %>
                        <div class="card border-danger mb-4">
                            <div class="card-header bg-danger text-white">
                                Error Details (Development Mode)
                            </div>
                            <div class="card-body text-start">
                                <pre class="small"><%= error.stack %></pre>
                            </div>
                        </div>
                    <% } %>
                    
                    <div class="d-flex gap-3 justify-content-center">
                        <a href="/" class="btn btn-primary btn-lg">
                            <i class="bi bi-house me-2"></i>Go Home
                        </a>
                        <button onclick="location.reload()" class="btn btn-outline-primary btn-lg">
                            <i class="bi bi-arrow-clockwise me-2"></i>Try Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
EOF

# Create basic contact, terms, privacy pages
cat > views/contacts.ejs << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div class="container">
            <a class="navbar-brand fw-bold text-primary" href="/dashboard">
                <i class="bi bi-calendar-heart me-2"></i>DaySave
            </a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="/dashboard">Dashboard</a>
                <a class="nav-link" href="/logout">Logout</a>
            </div>
        </div>
    </nav>

    <div class="container py-5">
        <h1 class="h3 fw-bold mb-4">Contacts</h1>
        <div class="card">
            <div class="card-body text-center py-5">
                <i class="bi bi-person-lines-fill text-muted" style="font-size: 4rem;"></i>
                <h4 class="mt-3 text-muted">No contacts yet</h4>
                <p class="text-muted">Contact management coming soon!</p>
            </div>
        </div>
    </div>
</body>
</html>
EOF

# Create placeholder pages
for page in terms privacy contact; do
    cat > views/${page}.ejs << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <h1 class="display-5 fw-bold mb-4">${page^}</h1>
                <div class="card">
                    <div class="card-body">
                        <p>This page is under construction.</p>
                        <a href="/" class="btn btn-primary">Go Home</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
EOF
done

echo "✅ Created all essential EJS view files:"
echo "   - views/index.ejs (Landing page)"
echo "   - views/login.ejs (Login page)"
echo "   - views/register.ejs (Registration page)"  
echo "   - views/dashboard.ejs (User dashboard)"
echo "   - views/error.ejs (Error page)"
echo "   - views/contacts.ejs (Contacts page)"
echo "   - views/terms.ejs (Terms page)"
echo "   - views/privacy.ejs (Privacy page)"
echo "   - views/contact.ejs (Contact page)"
echo ""
echo "🚀 Your DaySave app should now work completely!"
echo "   Visit: http://localhost:3000"

