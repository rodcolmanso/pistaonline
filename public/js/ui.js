// URL mapping, from hash to a function that responds to that URL action
const router = {
  "/": () => showContent("content-home"),
  "/profile": () =>
    requireAuth(() => showContent("content-profile"), "/profile"),
  "/admin": () =>
    requireRole('admin', () => showContent("content-admin"), "/admin"),
  "/manager": () =>
    requireRole(['manager', 'admin'], () => showContent("content-manager"), "/manager", false), // Any role works
  "/super": () =>
    requireRole(['admin', 'manager', 'supervisor'], () => showContent("content-super"), "/super", true), // Need ALL roles
  "/login": () => login()
};

//Declare helper functions

/**
 * Iterates over the elements matching 'selector' and passes them
 * to 'fn'
 * @param {*} selector The CSS selector to find
 * @param {*} fn The function to execute for every element
 */
const eachElement = (selector, fn) => {
  for (let e of document.querySelectorAll(selector)) {
    fn(e);
  }
};

/**
 * Tries to display a content panel that is referenced
 * by the specified route URL. These are matched using the
 * router, defined above.
 * @param {*} url The route URL
 */
const showContentFromUrl = (url) => {
  if (router[url]) {
    router[url]();
    return true;
  }

  return false;
};

/**
 * Returns true if `element` is a hyperlink that can be considered a link to another SPA route
 * @param {*} element The element to check
 */
const isRouteLink = (element) =>
  element.tagName === "A" && element.classList.contains("route-link");

/**
 * Displays a content panel specified by the given element id.
 * All the panels that participate in this flow should have the 'page' class applied,
 * so that it can be correctly hidden before the requested content is shown.
 * @param {*} id The id of the content to show
 */
const showContent = (id) => {
  eachElement(".page", (p) => p.classList.add("hidden"));
  document.getElementById(id)?document.getElementById(id).classList.remove("hidden"):null;
};

/**
 * Updates the user interface
 */
const updateUI = async () => {
  try {
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
      // Get both user profile and token claims
      const user = await auth0Client.getUser();
      const token = await auth0Client.getTokenSilently();
      
      console.log('Access Token:', token);
      
      // Decode the access token to get the roles claim
      const tokenParts = token.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      console.log('Token payload:', tokenPayload);
      
      // Look for roles in token payload
      const roles = tokenPayload.permissions || 
                   tokenPayload.roles ||
                   tokenPayload['https://tpmonline.com.br/roles'] ||
                   [];
                   
      console.log('Found roles:', roles);
      
      // Store roles in user object and format for display
      user.role = Array.isArray(roles) ? roles.join(', ') : roles;
      
      // If no roles found, set a default
      if (!user.role) {
        user.role = 'No roles assigned';
      }
      
      // Log complete user profile for debugging
      console.log('Final user object with roles:', user);

      document.getElementById("profile-data").innerText = JSON.stringify(
        user,
        null,
        2
      );

      document.querySelectorAll("pre code").forEach(hljs.highlightBlock);

      eachElement(".profile-image", (e) => (e.src = user.picture));
      eachElement(".user-name", (e) => (e.innerText = user.name));
      eachElement(".user-email", (e) => (e.innerText = user.email));
      eachElement(".user-role", (e) => (e.innerText = user.role));
      eachElement(".auth-invisible", (e) => e.classList.add("hidden"));
      eachElement(".auth-visible", (e) => e.classList.remove("hidden"));
    } else {
      eachElement(".auth-invisible", (e) => e.classList.remove("hidden"));
      eachElement(".auth-visible", (e) => e.classList.add("hidden"));
    }
  } catch (err) {
    console.log("Error updating UI!", err);
    return;
  }

  console.log("UI updated");
};

window.onpopstate = (e) => {
  if (e.state && e.state.url && router[e.state.url]) {
    showContentFromUrl(e.state.url);
  }
};
