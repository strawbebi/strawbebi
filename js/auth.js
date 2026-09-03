/*
 * OUR LITTLE ARCHIVE
 * Authentication
 */

const PRIVATE_HOME = "dashboard.html";
const LOGIN_PAGE = "login.html";


/* ==========================================
   ARCHIVE DISPLAY NAME
   ========================================== */

function getArchiveUserName(user) {

    const email =
        (user?.email || "").trim().toLowerCase();


    /* The two private archive accounts. */

    if (email === "vallejosvanessa59@gmail.com") {
        return "Kayla";
    }


    if (email === "villaryezchia@gmail.com") {
        return "Yezchia";
    }


    /* Fallback for any future account. */

    return
        user?.user_metadata?.name ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.display_name ||
        user?.email?.split("@")[0] ||
        "Name";
}


/* ==========================================
   CHECK IF SUPABASE IS CONFIGURED
   ========================================== */

function authIsConfigured() {

    return (
        typeof SUPABASE_URL === "string" &&
        typeof SUPABASE_PUBLISHABLE_KEY === "string" &&
        !SUPABASE_URL.includes("PASTE_YOUR_") &&
        !SUPABASE_PUBLISHABLE_KEY.includes("PASTE_YOUR_") &&
        typeof supabaseClient !== "undefined"
    );
}


/* ==========================================
   LOGIN MESSAGE
   ========================================== */

function setLoginMessage(message, type = "error") {

    const box = document.getElementById("loginMessage");

    if (!box) return;

    box.textContent = message;

    box.className = `login-message ${type}`;

    box.hidden = false;
}


/* ==========================================
   LOGIN BUTTON LOADING
   ========================================== */

function setLoginLoading(isLoading) {

    const button = document.getElementById("loginButton");

    if (!button) return;

    button.disabled = isLoading;

    button.textContent = isLoading
        ? "SIGNING IN..."
        : "SIGN IN";
}


/* ==========================================
   SIGN IN
   ========================================== */

async function signIn(event) {

    event.preventDefault();


    /* Check Supabase configuration */

    if (!authIsConfigured()) {

        setLoginMessage(
            "The private login is not connected yet. Please check your Supabase configuration.",
            "error"
        );

        return;
    }


    /* Get email and password */

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    /* Basic validation */

    if (!email || !password) {

        setLoginMessage(
            "Please enter both your email and password.",
            "error"
        );

        return;
    }


    /* Show loading */

    setLoginLoading(true);


    const messageBox =
        document.getElementById("loginMessage");

    if (messageBox) {
        messageBox.hidden = true;
    }


    try {

        console.log("Attempting Supabase login...");
        console.log("Email:", email);


        /* ==========================================
           SUPABASE LOGIN
           ========================================== */

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        /* ==========================================
           LOGIN ERROR
           ========================================== */

        if (error) {

            console.error(
                "SUPABASE LOGIN ERROR:",
                error
            );


            setLoginLoading(false);


            /*
             * TEMPORARY DEBUG MESSAGE
             *
             * This shows us the exact reason
             * Supabase rejected the login.
             */

            setLoginMessage(
                `Login failed: ${error.message}`,
                "error"
            );


            return;
        }


        /* ==========================================
           CHECK USER
           ========================================== */

        if (!data || !data.user) {

            console.error(
                "Login returned no user:",
                data
            );


            setLoginLoading(false);


            setLoginMessage(
                "We couldn't verify your account. Please try again.",
                "error"
            );


            return;
        }


        /* ==========================================
           SUCCESS
           ========================================== */

        console.log(
            "LOGIN SUCCESSFUL!",
            data.user.email
        );


        /*
         * Send the user to the dashboard.
         */

        window.location.replace(
            PRIVATE_HOME
        );

    }


    /* ==========================================
       UNEXPECTED ERROR
       ========================================== */

    catch (error) {

        console.error(
            "UNEXPECTED LOGIN ERROR:",
            error
        );


        setLoginLoading(false);


        setLoginMessage(
            `Something went wrong: ${error.message || error}`,
            "error"
        );

    }

}


/* ==========================================
   PROTECT PRIVATE PAGES
   ========================================== */

async function protectPage() {

    if (!authIsConfigured()) {

        console.warn(
            "Supabase is not configured."
        );

        return;
    }


    try {

        const {
            data: { user },
            error
        } = await supabaseClient.auth.getUser();


        /* No authenticated user */

        if (error || !user) {

            window.location.replace(
                LOGIN_PAGE
            );

            return;
        }


        /* ==========================================
           DISPLAY USER EMAIL
           ========================================== */

        const emailTargets =
            document.querySelectorAll(
                "[data-user-email]"
            );


        emailTargets.forEach(element => {

            element.textContent =
                user.email || "";

        });


        /* ==========================================
           DISPLAY USER NAME
           ========================================== */

        const nameTargets =
            document.querySelectorAll(
                "[data-user-name]"
            );


        nameTargets.forEach(element => {

            const name =
                getArchiveUserName(user);

            element.textContent = name;

        });

    }


    catch (error) {

        console.error(
            "Authentication check failed:",
            error
        );


        window.location.replace(
            LOGIN_PAGE
        );

    }

}


/* ==========================================
   LOG OUT
   ========================================== */

async function signOut() {

    if (!authIsConfigured()) {

        window.location.replace(
            LOGIN_PAGE
        );

        return;
    }


    try {

        const { error } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Sign-out error:",
                error
            );

            return;
        }


        window.location.replace(
            LOGIN_PAGE
        );

    }


    catch (error) {

        console.error(
            "Unexpected sign-out error:",
            error
        );

    }

}


/* ==========================================
   REDIRECT IF ALREADY SIGNED IN
   ========================================== */

async function redirectIfAlreadySignedIn() {

    if (!authIsConfigured()) {

        return;
    }


    try {

        const {
            data: { user },
            error
        } = await supabaseClient.auth.getUser();


        if (error) {

            console.error(
                "Session check error:",
                error
            );

            return;
        }


        if (user) {

            console.log(
                "Already signed in:",
                user.email
            );


            window.location.replace(
                PRIVATE_HOME
            );

        }

    }


    catch (error) {

        console.error(
            "Unexpected session error:",
            error
        );

    }

}