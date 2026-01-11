const styles = new CSSStyleSheet();
styles.replaceSync(/* css */`
    ul {
        list-style: none;
        margin: 0;
        padding: 16px;
        display: flex;
        gap: 8px;
        flex-direction: column;

        a {
            text-decoration: none;
            color: var(--primary-color, blue);

            &:hover {
                text-decoration: underline;
            }
        }
    }
`);

const pages = [
    { name: "Button", href: "/components/button.html" },
    { name: "Card", href: "/components/card.html" },
    { name: "Menu", href: "/components/menu.html" },
    { name: "Typography", href: "/components/typography.html" },
];

const template = document.createElement("template");
template.innerHTML = /* html */`
    <nav>
        <ul>
            ${pages.map(page => `<li><a href="${page.href}">${page.name}</a></li>`).join("")}
        </ul>
    </nav>
`;
export class SiteNav extends HTMLElement {
    static define(tagName = "site-nav") {
        customElements.define(tagName, this)
    }
    shadowRoot = this.attachShadow({ mode: "open" });

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [styles]
        this.shadowRoot.replaceChildren(template.content.cloneNode(true))
    }
}

SiteNav.define()