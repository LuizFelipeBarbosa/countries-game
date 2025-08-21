export const applyHighlighting = (svgDoc, color, countryList) => {
    if (!svgDoc) return;
    const taiwanElement = svgDoc.getElementById("tw");
    const kosovoElement = svgDoc.getElementById("xk");

    countryList.forEach((alpha2Code) => {
        const countryElement = svgDoc.getElementById(alpha2Code);

        if (countryElement) {
            countryElement.style.fill = color;

            const descendants = countryElement.querySelectorAll("*");
            descendants.forEach((element) => {
                if (
                    (alpha2Code === "rs" &&
                        kosovoElement &&
                        kosovoElement.contains(element)) ||
                    (alpha2Code === "cn" &&
                        taiwanElement &&
                        taiwanElement.contains(element))
                ) {
                    return;
                }
                element.style.fill = color;
            });
        } else {
            console.warn(
                `Country with id '${alpha2Code}' not found in the SVG.`
            );
        }
    });
};
