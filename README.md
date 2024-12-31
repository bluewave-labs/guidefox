![](https://img.shields.io/github/license/bluewave-labs/bluewave-onboarding)
![](https://img.shields.io/github/repo-size/bluewave-labs/bluewave-onboarding)
![](https://img.shields.io/github/commit-activity/w/bluewave-labs/bluewave-onboarding)
![](https://img.shields.io/github/last-commit/bluewave-labs/bluewave-onboarding)
![](https://img.shields.io/github/languages/top/bluewave-labs/bluewave-onboarding)
![](https://img.shields.io/github/issues-pr/bluewave-labs/bluewave-onboarding)
![](https://img.shields.io/github/issues/bluewave-labs/bluewave-onboarding)

# BlueWave Onboarding

BlueWave Onboarding helps app owners build knowledge and user-experience oriented apps. It includes the following features: 

- Welcome tours
- Product hints
- Checklists
- Popups
- Banners
- Links

This is a work-in-progress application. The source code is available under GNU AGPLv3.

![Main dashboard](https://github.com/bluewave-labs/bluewave-onboarding/blob/master/Dashboard.png)


## Tech stack

- [ReactJs](https://react.dev/)
- [MUI (React framework)](https://mui.com/)
- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://postgresql.org)


## Installation

1. Make sure Docker is installed to your machine where the server will run.
2. Make sure git is installed to your machine Git.
3. Make sure nginx is installed.

4. Clone GitHub Repository

```
cd ~
git clone https://github.com/bluewave-labs/bluewave-onboarding.git
cd bluewave-onboarding
```

5. Configure Nginx

Open the Nginx configuration file:

``sudo nano /etc/nginx/sites-available/onboarding-demo``

Add the following configuration. Change YOUR_DOMAIN_NAME with your domain name:

```server {
    listen 80;
    server_name YOUR_DOMAIN_NAME;
    return 301 https://$host$request_uri; 
    }

server {
    listen 443 ssl;
    server_name YOUR_DOMAIN_NAME;
    ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN_NAME/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:4173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```


6. Create a symbolic link to enable the configuration:

``sudo ln -s /etc/nginx/sites-available/onboarding-demo /etc/nginx/sites-enabled/``

7. Install Certbot and its Nginx plugin:

``sudo apt install certbot python3-certbot-nginx``

8. Obtain SSL Certificate. Run Certbot to obtain a certificate for your domain:

``sudo certbot --nginx``

9. Verify the Nginx configuration:

``sudo nginx -t``

10. Restart Nginx to apply the changes:

``sudo systemctl restart nginx``

11. Start the project

``cd ~/bluewave-onboarding
docker compose up -d``

## Contributing

Here's how you can contribute to the Onboarding product. 

- Check [Contributor's guideline](https://github.com/bluewave-labs/bluewave-onboarding/blob/master/CONTRIBUTING.md)
- Have a look at our Figma designs [here](https://www.figma.com/design/MLPbP1HM2L9ON6f88pHTee/Onboarding?node-id=0-1&t=iwgz015l5QWbWRqU-1). We encourage you to copy to your own Figma page, then work on it as it is read-only.
- Open an issue if you believe you've encountered a bug
- Make a pull request to add new features/make quality-of-life improvements/fix bugs.
- Make sure your send your PRs to **develop** branch.


