const constants = require("../src/utils/constants.helper");
const userRole = constants.ROLE;

async function runSeeders(queryInterface) {
  const hashedPassword = "$2a$10$vJk551TfHzR8WpiqKlaFe.L8ORsoOPQnwAt0mVzPLpyjdpZNFSM2a"; // Bluewave@1234!

  await queryInterface.bulkInsert(
    "users",
    [
      {
        name: "Demo",
        surname: "User",
        email: "bluewaveguidefox@gmail.com",
        password: hashedPassword,
        role: userRole.ADMIN,
        createdAt: new Date(),
      },
    ],
    {}
  );

  await queryInterface.bulkInsert(
    'hints',
    [
      {
        action: 'open url',
        url: 'https://guidefox-demo.bluewavelabs.ca',
        actionButtonUrl: 'https://guidefox.io/',
        actionButtonText: 'Take me to GuideFox page',
        targetElement: '._text_ophip_12',
        tooltipPlacement: 'right',
        hintContent:
          'Guidefox helps app owners build knowledge and user-experience oriented apps. It includes the following features: welcome tours, popups, banners, helper links, hints',
        header: 'GuideFox Intro',
        headerBackgroundColor: '#FFFFFF',
        headerColor: '#101828',
        textColor: '#101828',
        buttonBackgroundColor: '#7F56D9',
        buttonTextColor: '#FFFFFF',
        createdBy: 1,
        repetitionType: 'show only once',
        isHintIconVisible: true
      },
    ],
    {}
  );

  await queryInterface.bulkInsert(
    "popups",
    [
      {
        popupSize: "small",
        closeButtonAction: "open url",
        url: "https://guidefox-demo.bluewavelabs.ca",
        actionUrl: "https://guidefox.io/",
        actionButtonText: "Go to guidefox.io",
        headerBackgroundColor: "#e4c2f0",
        headerColor: "#450fbd",
        textColor: "#4889f4",
        buttonBackgroundColor: "#7F56D9",
        buttonTextColor: "#FFFFFF",
        header: "Welcome",
        content: "<p>Welcome to GuideFox<p>",
        repetitionType: "show every visit",
        createdBy: 1
      },
    ],
    {}
  );

  await queryInterface.bulkInsert(
    "banners",
    [
      {
        closeButtonAction: "open url",
        position: "top",
        url: "https://guidefox-demo.bluewavelabs.ca",
        fontColor: "#ffffff",
        backgroundColor: "#5e4b7b",
        bannerText: "Welcome",
        repetitionType: "show every visit",
        createdBy: 1
      }
    ],
    {}
  );

  const [helperLink] = await queryInterface.bulkInsert(
    'helper_link',
    [
      {
        title: 'GuideFox Links',
        headerBackgroundColor: '#adb2f5',
        linkFontColor: '#344054',
        iconColor: '#7F56D9',
        createdBy: 1,
      },
    ],
    { returning: true } // Return the created row to use its ID
  );

  const links = [
    { title: 'GuideFox Website', url: 'https://guidefox-demo.bluewavelabs.ca', target: true, helperId: helperLink.id },
    { title: 'GuideFox Repo', url: 'https://github.com/bluewave-labs/guidefox', target: false, helperId: helperLink.id },
  ];

  await queryInterface.bulkInsert('link', links, {});

  await queryInterface.bulkInsert(
    "teams",
    [
      {
        name: 'Bluewave',
        createdAt: new Date(),
        serverUrl: 'https://guidefox-demo.bluewavelabs.ca/api/',
        agentUrl: 'https://cdn.jsdelivr.net/gh/bluewave-labs/bluewave-onboarding@agent-1.0.2/jsAgent/'
      }
    ],
    {}
  );
}

module.exports = { runSeeders };
