// The Auth0 client, initialized in configureClient()
let auth0Client = null;

/**
 * Starts the authentication flow
 */
const login = async (targetUrl) => {
  try {
    console.log("Logging in", targetUrl);

    const options = {
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    };

    if (targetUrl) {
      options.appState = { targetUrl };
    }

    await auth0Client.loginWithRedirect(options);
    // await auth0Client.loginWithPopup();
    await updateUI();
  } catch (err) {
    if (err.error !== 'popup_closed_by_user') {
      // showError(err.message);
      console.log("popup_closed_by_user", err);
    }
    console.log("Log in failed", err);
  }
};

/**
 * Executes the logout flow
 */
const logout = async () => {
  try {
    console.log("Logging out");
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  } catch (err) {
    console.log("Log out failed", err);
  }
};

/**
 * Retrieves the auth configuration from the server
 */
const fetchAuthConfig = () => fetch("/auth_config.json");
/**
 * Initializes the Auth0 client
 */
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0Client = await auth0.createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
    cacheLocation: 'localstorage', // This enables persistent authentication
    useRefreshTokens: true, // This allows automatic silent token refresh
    authorizationParams: {
      scope: 'openid profile email',
      audience: `https://${config.domain}/api/v2/`,
      // organization: 'StandBy',
    }
  });
};

/**
 * Checks to see if the user is authenticated. If so, `fn` is executed. Otherwise, the user
 * is prompted to log in
 * @param {*} fn The function to execute if the user is logged in
 */

const requireAuth = async (fn, targetUrl) => {
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    return fn();
  }

  return login(targetUrl);
};

/**
 * Checks if the authenticated user has the required role(s)
 * @param {string|string[]} requiredRoles - Single role or array of roles
 * @param {Function} fn - Function to execute if user has required role(s)
 * @param {string} targetUrl - URL to redirect to after login
 * @param {boolean} requireAll - If true, user must have ALL roles. If false, ANY role is sufficient
 */
const requireRole = async (requiredRoles, fn, targetUrl, requireAll = false) => {
  const isAuthenticated = await auth0Client.isAuthenticated();
  if (!isAuthenticated) {
    return login(targetUrl);
  }
  
  try {
    // Get token and decode its payload
    const token = await auth0Client.getTokenSilently();
    const tokenParts = token.split('.');
    const tokenPayload = JSON.parse(atob(tokenParts[1]));
    
    // Extract roles from various possible locations
    const userRoles = tokenPayload.permissions || 
                     tokenPayload.roles ||
                     tokenPayload['https://pista.online/roles'] ||
                     [];
    
    console.log('User roles from token:', userRoles);
    
    // Convert single role to array for consistent handling
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // Check if user has required role(s)
    const hasAccess = requireAll
      ? roles.every(role => userRoles.includes(role)) // Must have ALL roles
      : roles.some(role => userRoles.includes(role)); // Must have ANY role
      
    if (hasAccess) {
      return fn();
    }
    
    // Handle unauthorized access
    console.log('Access denied: required role(s) not found');
    showContent('content-unauthorized');
  } catch (error) {
    console.error('Error checking roles:', error);
    // return login(targetUrl);
      return fn();
  }
  
  // Handle unauthorized access
  console.log('Access denied: required role(s) not found');
  showContent('content-unauthorized');
};

// Will run when page finishes loading
window.onload = async () => {
  await configureClient();

  // If unable to parse the history hash, default to the root URL
  if (!showContentFromUrl(window.location.pathname)) {
    showContentFromUrl("/");
    window.history.replaceState({ url: "/" }, {}, "/");
  }

  const bodyElement = document.getElementsByTagName("body")[0];

  // Listen out for clicks on any hyperlink that navigates to a #/ URL
  bodyElement.addEventListener("click", (e) => {
    if (isRouteLink(e.target)) {
      const url = e.target.getAttribute("href");

      if (showContentFromUrl(url)) {
        e.preventDefault();
        window.history.pushState({ url }, {}, url);
      }
    }
  });

  // Check if the user is authenticated
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    console.log("> User is authenticated");
    
    // Check if token needs refresh
    try {
      await auth0Client.getTokenSilently();
      console.log("> Token refreshed silently if needed");
    } catch (error) {
      console.log("> Error refreshing token:", error);
      // Token couldn't be refreshed - user needs to login again
      await logout();
      return;
    }

    window.history.replaceState({}, document.title, window.location.pathname);
    updateUI();
    return;
  }

  console.log("> User not authenticated");
  
  

  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");

  if (shouldParseResult) {
    console.log("> Parsing redirect");
    try {
      const result = await auth0Client.handleRedirectCallback();

      if (result.appState && result.appState.targetUrl) {
        showContentFromUrl(result.appState.targetUrl);
      }

      console.log("Logged in!");
    } catch (err) {
      console.log("Error parsing redirect:", err);
    }

    window.history.replaceState({}, document.title, "/");
  }

  updateUI();
};

async function getFuncPing() {
  // const user= netlifyIdentity.currentUser();
  const token= await auth0Client.getTokenSilently();
    let _headers= {"Content-type": "application/json; charset=UTF-8"} ;
    if(token){
        _headers.Authorization= `Bearer ${token}` ;
    }
  return fetch('/.netlify/functions/funcping', {
    method: 'GET',
    headers: _headers
  }).then(response => response.json())
  .then(json => {
    console.log('Func Ping response:', json);
    return json;
  })
  .catch(err => {
    console.error('Error calling Func Ping:', err);
  }); 
}
