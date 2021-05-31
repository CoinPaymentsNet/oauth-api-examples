/**
 * @property {number} clientId CoinPayments.NET Client ID
 * @property {HTMLDivElement} clientInputBlock HTML Template input field
 */

/**
 * Custom element that renders clientIdField block
 * @extends {HTMLElement}
 */
export class ClientIdField extends HTMLElement {

    client_id = {"query": "#client-id", "target": HTMLElement}

    /**
     * Create a new instance of
     */
    constructor() {
        super();
    }

    async connectedCallback() {
        const response = await fetch("./js/clientIdField/clientIdField.html");
        this.innerHTML = await response.text();

        this.client_id.target = this.querySelector(this.client_id.query);
        this.client_id.target.addEventListener("keyup", (e) => this.setClientId(e));

        this.client_id.value = this.client_id.target.value = sessionStorage.getItem(this.client_id.query);
    }

    getClientId() {
        if (!this.client_id.value) {
            throw new Error("Client ID is required");
        }
        return this.client_id.value
    }

    setClientId(e) {
        this.client_id.value = e.target.value;
        sessionStorage.setItem(this.client_id.query, this.client_id.value)
    }
}

