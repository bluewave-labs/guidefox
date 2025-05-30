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
        actionButtonUrl: "https://guidefox.io/",
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
        url: 'https://guidefox-demo.bluewavelabs.ca/'
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
        agentUrl: 'https://cdn.jsdelivr.net/gh/bluewave-labs/bluewave-onboarding@agent-1.1.4/jsAgent/'
      }
    ],
    {}
  );
  const [tour] = await queryInterface.bulkInsert(
    'tours',
    [
      {
        headerColor: '#101828',
        textColor: '#344054',
        buttonBackgroundColor: '#7F56D9',
        buttonTextColor: '#ffffff',
        size: 'medium', // assuming settings.tour.size[1] is 'medium'
        finalButtonText: 'Complete tour',
        url: 'https://guidefox-demo.bluewavelabs.ca/',
        active: true,
        createdBy: 1,
      },
    ],
    { returning: true }
  );

  const tourPopups = [
    {
      title: 'Popup 1',
      header: 'See your popup views',
      description: 'Explore the popup views available in your dashboard.',
      targetElement: 'div:nth-child(2)>div:nth-child(4)>div:nth-child(1)',
      order: 1,
      tourId: tour.id,
    },
    {
      title: 'Popup 2',
      header: 'See your banner views',
      description: 'Check out your banner views and customize them.',
      targetElement: 'div:nth-child(2)>div:nth-child(4)>div:nth-child(2)',
      order: 2,
      tourId: tour.id,
    },
    {
      title: 'Popup 3',
      header: 'See your helper link views',
      description: 'Review and manage your helper link views.',
      targetElement: 'div:nth-child(2)>div:nth-child(4)>div:nth-child(3)',
      order: 3,
      tourId: tour.id,
    },
  ];

  await queryInterface.bulkInsert('tour_popup', tourPopups, {});
}

module.exports = { runSeeders };
