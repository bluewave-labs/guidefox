import React, { useState, useEffect } from "react";
import styles from "./CodeTab.module.css";
import CustomTextField from "@components/TextFieldComponents/CustomTextField/CustomTextField";
import Button from "@components/Button/Button";
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { emitToastError } from "../../../utils/guideHelper";
import { getServerUrl, addServerUrl } from '../../../services/teamServices';
import toastEmitter, { TOAST_EMITTER_KEY } from "../../../utils/toastEmitter";
import { URL_REGEX } from "../../../utils/constants";

const CodeTab = () => {
    const [serverUrl, setServerUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const validateServerUrl = url => {
        const errors = [];

        if (url === "") {
            return { valid: true, errors: null };
        }

        if (!URL_REGEX.PROTOCOL.test(url)) {
            errors.push("Invalid or missing protocol (must be 'http://' or 'https://').")
        }

        const domainMatch = url.match(URL_REGEX.DOMAIN);
        if (!domainMatch) {
            errors.push("Invalid domain name (must include a valid top-level domain like '.com').");
        } else {
            const domain = domainMatch[1];
            if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
                errors.push(`Malformed domain: '${domain}'.`);
            }
        }

        if (errors.length === 0) {
            return { valid: true, errors: null }
        }

        return { valid: false, errors }
    };

    useEffect(() => {
        const fetchServerUrl = async () => {
            try {
                const { serverUrl } = await getServerUrl();
                setServerUrl(serverUrl);
            } catch (err) {
                console.error('Error fetching server url: ', err);
            }
        }
        fetchServerUrl();
    }, [])

    const handleUrlChange = (e) => {
        setServerUrl(e.target.value);
    };

    const onSave = async () => {
        const { valid, errors } = validateServerUrl(serverUrl);

        if (!valid) {
            errors.forEach(err => {
                toastEmitter.emit(TOAST_EMITTER_KEY, err);
            });
            return;
        }

        try {
            setIsLoading(true);
            const response = await addServerUrl(serverUrl);
            toastEmitter.emit(TOAST_EMITTER_KEY, response.message);
        } catch (err) {
            emitToastError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const codeToCopy = `
        <!-- Client-side HTML/JS Snippet to be integrated into their website -->
        <script>
            (function() {
                const apiUrl = '${serverUrl}';

                var s=document.createElement("script");
                s.type="text/javascript";
                s.async=false;
                s.onerror=()=>{console.log("onboard not loaded");};
                s.src = 'http://localhost:8082/main.js';
                (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(s);
            })();
        </script>
        `;

    const handleCopy = () => {
        navigator.clipboard.writeText(codeToCopy)
            .then(() => {
                toastEmitter.emit(TOAST_EMITTER_KEY, 'Code copied to clipboard');
            })
            .catch((err) => {
                toastEmitter.emit(TOAST_EMITTER_KEY, err);
            });
    };

    return (
        <section className={styles.container}>
            <h2>API key management</h2>
            <p className={styles.content}>Manage the key that Onboarding app uses to authenticate the agent code.</p>

            {/* server url */}
            <div className={styles.block}>
                <p className={styles.label}>Server URL:</p>
                <CustomTextField
                    value={serverUrl}
                    onChange={handleUrlChange}
                    style={{ textAlign: 'right' }}
                    TextFieldWidth="550px"
                />
                <span />
                <Button text='Save' sx={{ width: '120px' }} onClick={onSave} />
            </div>
            <h2 style={{ marginTop: '25px' }}>Code in your webpage</h2>
            <div className={styles.informativeBlock}>
                <p className={styles.content}>
                    Code snippet to copy in your web page between {"<head>"} and {"</head>"}. Make sure you edit the API URL.
                </p>
                <ContentCopyOutlinedIcon
                    onClick={handleCopy}
                    style={{
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: 'var(--main-text-color)',
                    }}
                    />
            </div>

            <pre><code>{codeToCopy}</code></pre>
        </section>
    )
}

export default CodeTab;