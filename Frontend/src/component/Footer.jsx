import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Footer = () => {

    const {token} =useContext(UserContext)
    return (
        <footer className="footer">
                <div className="content has-text-centered">
                <p>
                    <strong>Wise Wallet</strong> by <a href="https://jgthms.com">David Hyppolite</a>.
                    The source code is licensed
                    <a href="https://opensource.org/license/mit"> MIT</a>. The
                    website content is licensed
                    <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/"> CC BY NC SA 4.0</a>.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
