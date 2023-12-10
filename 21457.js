// Điền dữ liệu từ biến theo cú pháp
function fillData(template, data) {
    const regex = /21457{\s*([^}\s]+)\s*}/g;
    return template.replace(regex, (match, variable) => {
        const value = data[variable];
        return value !== undefined ? value : match;
    });
}

//Xử lý được biểu thức điều kiện theo cú pháp: 
function processIfElse(template, data) {
    const regex = /21457{if\s+([^}]+)}([\s\S]*?){else}([\s\S]*?){\/if}/g;

    return template.replace(regex, (match, condition, ifContent, elseContent) => {
        //console.log(data)
        const isTrue = evalCondition(condition, data);
        return isTrue ? ifContent.trim() : elseContent.trim();
    });
}
function evalCondition(condition, data) {
    const variables = Object.keys(data);
    const values = Object.values(data);

    // Create a function with template variables as arguments
    const templateFunction = new Function(...variables, `return ${condition};`);

    try {
        // Execute the function with actual data values
        return templateFunction(...values);
    } catch (error) {
        // console.error('Error evaluating condition:', error);
        return false;
    }
}

//Xử lý được biểu thức vòng lặp theo cú pháp
function processLoop(template, data) {
    const regex = /21457{for\s+([^}\s]+)\s+in\s+([^}\s]+)}([\s\S]*?){\/for}/g;
    //console.log("ok")
    //  console.log(data)
    return template.replace(regex, (match, variable, array, loopContent) => {
        // console.log(variable);
        // console.log(array);
        // console.log(loopContent)
        const arrayData = data[array];

        // console.log(arrayData)
        if (Array.isArray(arrayData)) {
            return arrayData.map(item => {
                //console.log(item)
                const loopData = { ...data, [variable]: item };
                //  console.log(loopData)
                return renderLoopContent(loopContent, loopData);
            }).join('');
        } else {
            console.error(`Error: '${array}' is not an array.`);
            return '';
        }
    });
}
function renderLoopContent(loopContent, loopData) {
    const regex = /21457{([^}\s]+)}/g;
    return loopContent.replace(regex, (match, loopVariable) => {
        ///console.log(loopData[loopVariable])
        let attr = loopVariable.split('.')[1];
        item = loopVariable.split('.')[0];
        // console.log(attr)
        // console.log(item);
        //console.log(loopData[`${item}`][`${attr}`]);

        return loopData[`${item}`][`${attr}`] !== undefined ? loopData[`${item}`][`${attr}`] : match;
    });
}

// Xử lý được biểu thức điều kiện lồng nhau: /// xem lai phan nay !!!!!!!!
function processNestedCondition(template, data) {
    const regex = /21457{if\s+([^}]+)}([\s\S]*?)(21457{if\s+([^}]+)}([\s\S]*?){\/if}|{\/if})/g;

    return template.replace(regex, (match, condition1, content1, nestedIfMatch, condition2, nestedIfContent) => {
        // console.log("ok1");
        //console.log(nestedIfContent);

        const isTrue1 = evalCondition(condition1, data);

        if (isTrue1) {
            if (nestedIfMatch) {
                const isTrue2 = evalCondition(condition2, data);
                return isTrue2 ? nestedIfContent.trim() : '';
            } else {
                return content1.trim();
            }
        } else {
            return nestedIfContent.trim();
        }
    });
}

/// Xử lý được biểu thức vòng lặp lồng nhau
function nestedLoop(template, data) {
    /*const regex = /21457{for\s+([^}\s]+)\s+in\s+([^}\s]+)}([\s\S]*?){\/for}/g;
    //console.log("ok")

    return template.replace(regex, (match, variable, array, content) => {
        console.log("ok")
        console.log(variable);
        console.log(array);
        // console.log(variable2);
        console.log(content);
        //console.log(content2);

        const data1 = data[array1];
        if (Array.isArray(data1)) {
            return data1.map(item1 => {
                const loopData1 = { ...data, [variable1]: item1 };
                const data2 = item1[array2];

                if (Array.isArray(data2)) {
                    return data2.map(item2 => {
                        const loopData2 = { ...loopData1, [variable2]: item2 };
                        return renderLoopContent1(content2, loopData2);
                    }).join('');
                } else {
                    console.error(`Error: '${array2}' is not an array.`);
                    return '';
                }
            }).join('');
        } else {
            console.error(`Error: '${array1}' is not an array.`);
            return '';
        }
    });*/
    const loopRegex = /21457{for\s+([^}\s]+)\s+in\s+([^}\s]+)}([\s\S]*?)({\/for}|<\/for>)/g;

    return template.replace(loopRegex, (match, variable, array, content) => {
        //  console.log(variable)
        // console.log(array);
        //console.log(data)
        //console.log(content);
        const arrayData = getValueFromData(array, data);
        // console.log(arrayData);
        content += '{/for}'
        console.log(content)

        if (Array.isArray(arrayData)) {
            return arrayData.map(item => {
                const loopData = { ...data, [variable]: item };
                return nestedLoop(content, loopData);
            }).join('');
        } else {
            console.error(`Error: '${array}' is not an array.`);
            return '';
        }
    });
}
function getValueFromData(variable, data) {
    const keys = variable.split('.');
    let value = data;

    for (const key of keys) {
        if (value && value.hasOwnProperty(key)) {
            value = value[key];
        } else {
            console.error(`Error: '${variable}' is not found in the data.`);
            return undefined;
        }
    }

    return value;
}


function renderLoopContent1(loopContent, loopData) {
    const regex = /21457{([^}\s]+)}/g;
    return loopContent.replace(regex, (match, loopVariable) => {
        const value = loopData[loopVariable];
        return value !== undefined ? value : match;
    });
}


// process xu li tinh toan
function processExpression(template, data) {
    const regex = /21457{([^{}]+)}/g;

    return template.replace(regex, (match, expression) => {
        try {
            // Evaluate the expression
            const result = evalInContext(expression, data);
            // console.log(expression);
            // If the result is undefined or null, replace the expression with an empty string
            return result !== undefined && result !== null ? result : '';
        } catch (error) {
            console.error('Error evaluating expression:', error);
            return ''; // Return an empty string in case of an error
        }
    });
}

function evalInContext(expression, context) {
    try {
        const evalFunction = new Function(...Object.keys(context), `return ${expression};`);
        return evalFunction(...Object.values(context))
    } catch (error) {
        //
    }
    ;
}
// xu li chia thanh cac components


function renderTemplate(template, data) {

    template = fillData(template, data);
    // template = processExpression(template, data);
    template = processLoop(template, data);
    template = processIfElse(template, data);
    return template;
}

module.exports = renderTemplate;