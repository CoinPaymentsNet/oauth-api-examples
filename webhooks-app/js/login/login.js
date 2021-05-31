export class Login extends HTMLElement {
    login_button = {"query": "#singin-button", "target": HTMLElement};

    /**
     * Create a new instance of
     */
    constructor() {
        super();
    }

    setRequest(request) {
        this.request = request
    }

    async connectedCallback() {
        const response = await fetch("./js/login/login.html");
        this.innerHTML = await response.text();
        this.login_button.target = this.querySelector(this.login_button.query);

        let custom_elem = this;
        this.request.isLoggedIn().then((res) => {
            if (!res) {
                custom_elem.login_button.target.innerText = "Sign in"
                this.login_button.target.addEventListener("click", () => this.login());
            } else {
                custom_elem.login_button.target.innerText = "Sign out";
                this.login_button.target.addEventListener("click", () => this.logout());
            }
        })
    }

    login() {
        this.request.client.user.signinRedirect()
    }

    logout() {
        this.request.client.user.signout()
    }
}