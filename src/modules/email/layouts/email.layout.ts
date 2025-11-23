import { style } from './style.layout';

export const baseHtmlTemplateSource = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>{{title}}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	${style}
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <p class="header-title">Garage App</p>
      </div>

      <div class="body">
        <h1>{{title}}</h1>

        <p class="greeting">{{greeting}}</p>

        {{#each mainTextLines}}
          <p>{{this}}</p>
        {{/each}}

        {{#if button}}
          <div class="button-wrapper">
            <a
              href="{{button.url}}"
              class="button"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{button.label}}
            </a>
          </div>

          <p class="secondary-text">
            If the button does not work, copy and paste this link into your browser:
          </p>
          <p class="secondary-text link">{{button.url}}</p>
        {{/if}}
      </div>

      <div class="footer">
        <p>Garage App &middot; Please do not reply to this email.</p>
        {{#if footerText}}
          <p>{{footerText}}</p>
        {{/if}}
      </div>
    </div>
  </div>
</body>
</html>
`;
