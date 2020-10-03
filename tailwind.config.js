const plugin = require("tailwindcss/plugin");

module.exports = {
  theme: {
    inset: {
      "0": "0",
      "1": "15px",
      centerX: "auto; left:50%; transform: translateX(-50%);",
      centerY: "auto; top:50%; transform: translateY(-50%);"
    }

    // screens: {
    //   mobile: "480px",

    //   tablet: "640px",
    //   // => @media (min-width: 640px) { ... }

    //   laptop: "1024px",
    //   // => @media (min-width: 1024px) { ... }

    //   desktop: "1280px"
    //   // => @media (min-width: 1280px) { ... }
    // }
  },
  variants: {
    width: ["responsive"],
    inset: ["responsive"],
    borderColor: ["responsive", "hover", "focus"],
    background: ["hover"],
    transitionDuration: ["hover"]
  },
  plugins: [
    plugin(function({ addUtilities }) {
      const newUtilities = {
        ".left-center": {
          transform: "translateX(-50%)",
          left: "50%"
        },
        ".top-center": {
          transform: "translateY(-50%)",
          top: "50%"
        },
        ".both-center": {
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%"
        }
      };

      addUtilities(newUtilities, ["responsive"]);
    })
  ]
};

var obj = {
  custom: {
    inset: {
      centerX: ["left:50%;", "transform: translateX(-50%);"],
      centerY: ["top:50%;", "transform: translateY(-50%);"]
    }
  },
  variants: {
    "custom.inset": ["responsive", "hover", "focus", "active"]
  }
};
