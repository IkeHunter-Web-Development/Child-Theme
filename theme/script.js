/**
 * Child theme scripts.
 * 
 * @SETUP 
 * To enable dynamic color and type info on the dev guide,
 * switch out the DEVGUIDE_ID_CLASS and ELEMENTOR_KIT_CLASS with
 * the correct values for your site. Check the body tag on the
 * dev guide page to find the correct classes.
 * 
 * @USAGE
 * (1) Dynamic Color Info
 * Add the following classes to the column containing the
 * color box (heading widget) and description (text widget):
 * - dynamic-color
 * 
 * (2) Dynamic Type Info
 * Add the following IDs to the elements displaying the
 * type information:
 * - type-display (showing the type info)
 * - header-type (header element displaying header css)
 * - body-type (body element displaying body css)
 * 
 * (3) Logging
 * When logging messages, use the consoleLog function in order
 * to not have messages logged to the console for guests. If you
 * want the messages to temporarily show for guests, set VERBOSE
 * to true.
 * 
 * @ENTRYPOINT
 * All functions should be called from the jQuery document ready
 * function. This ensures that the functions only run once the
 * page is loaded.
 */
let $ = jQuery;
const DEVGUIDE_ID_CLASS = "page-id-28";
const ELEMENTOR_KIT_CLASS = "elementor-kit-49";
const VERBOSE = false;

/** ================ */
/** HELPER FUNCTIONS */
/** ================ */
/**
 * Convert RGB to Hex.
 * Source: https://css-tricks.com/converting-color-spaces-in-javascript/
 *
 * @param {string} rgb The RGB value to convert.
 * @returns {string} The converted hex value.
 */
const RGBToHex = (rgb) => {
  // Choose correct separator
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(")")[0].split(sep);

  let r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
};

/** ================= */
/** PRIMARY FUNCTIONS */
/** ================= */
/**
 * Print message to the console.
 * This only prints if the admin bar is visible, and is meant
 * to show the developer that the custom scripts have loaded.
 */
const printDebugMessage = () => {
  if ($("body").hasClass("admin-bar")) {
    console.log("Custom Scripts loaded.");
  }
};

/**
 * Log to console if VERBOSE is true
 * SETUP: Set VERBOSE to true to enable logging
 *
 * @param {string} message
 */
function consoleLog(message, ...params) {
  let loggedIn = $("body").hasClass("admin-bar");
  if (VERBOSE || loggedIn) {
    console.log(message, ...params);
  }
}

/**
 * Get the type of font used for the header and body.
 * Dynamically update the type of font used in the dev guide.
 *
 * Use:
 * Add #type-display to element showing type info
 * Add #header-type to header element displaying header css
 * Add #body-type to body element displaying body css
 */
const getTypeInfo = () => {
  try {
    const typeTargetList = $("#type-display .elementor-icon-list-items").children();
    const headerTarget = $($(typeTargetList[0]).find(".elementor-icon-list-text"));
    const bodyTarget = $($(typeTargetList[1]).find(".elementor-icon-list-text"));

    let headerType = $("#header-type h1").css("fontFamily");
    let bodyType = $("#body-type").css("fontFamily");
    consoleLog("type: ", bodyType);

    headerType = headerType.split(",")[0].replace('"', "");
    bodyType = bodyType.split(",")[0].replace('"', "");

    headerTarget.text("Header: " + headerType);
    bodyTarget.text("Body: " + bodyType);
  } catch (error) {
    consoleLog("Error in getTypeInfo: ", error);
  }
};

/**
 * Extract color information from Elementor CSS variables.
 *
 * Use:
 * Add .dynamic-color to the column containing
 * 		 color box (heading widget) and description (text widget)
 */
const getColorInfo = () => {
  try {
    let colorBoxes = $(".dynamic-color");

    let kitVariables = Array.from(document.styleSheets)
      .filter((sheet) => sheet.href === null || sheet.href.startsWith(window.location.origin))
      .reduce(
        (acc, sheet) =>
          (acc = [
            ...acc,
            ...Array.from(sheet.cssRules).reduce(
              (def, rule) =>
                (def =
                  rule.selectorText === `.${ELEMENTOR_KIT_CLASS}`
                    ? [...def, ...Array.from(rule.style).filter((name) => name.startsWith("--"))]
                    : def),
              []
            ),
          ]),
        []
      );

    let cssVariableObjects = kitVariables.map((varName) => {
      return {
        name: varName,
        value: getComputedStyle(document.body).getPropertyValue(varName),
      };
    });

    for (let colorBox of colorBoxes) {
      colorBox = $(colorBox);
      let targetColor = colorBox.find(".elementor-widget-heading .elementor-widget-container");
      let cssValue = RGBToHex(targetColor.css("backgroundColor"));
      let colorBoxText = $(colorBox.find(".elementor-widget-text-editor"));

      let selectedVariable = cssVariableObjects.find((obj) => {
        return obj.value.toLowerCase() === cssValue;
      });

      colorBoxText.html(
        `<p>Hex: ${selectedVariable.value}</p><p>CSS: var(${selectedVariable.name})</p>`
      );
    }
  } catch (error) {
    consoleLog("Error in getColorInfo: ", error);
  }
};

/** ================================ */
/** ENTRYPOINT FOR PRIMARY FUNCTIONS */
/** ================================ */
/**
 * Global jQuery document ready function.
 * Load all functions in here to ensure they only run once the page is loaded.
 */
$(document).ready(() => {
  printDebugMessage();

  /** Dev Guide Only */
  if ($("body").hasClass(DEVGUIDE_ID_CLASS)) {
    getTypeInfo();
    getColorInfo();
  }
});
