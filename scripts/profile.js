const spinner = document.querySelector('.spinner-container');
const logoutBtn = document.querySelector('.logout')
const profileName = document.querySelectorAll('.profile-name, .infos div:nth-of-type(1) p:nth-of-type(1) span')
const profileEmail = document.querySelectorAll('.email,  .infos div p:nth-of-type(2) span')
const auditRatio = document.querySelectorAll('.auditRatio  span,  .infos div:nth-of-type(3) p:nth-of-type(2) span')
const all_audits = document.querySelectorAll('.audits span, .infos div:nth-of-type(2) p:nth-of-type(1) span')
const xp = document.querySelectorAll('.xp span, .infos div:nth-of-type(3) p:nth-of-type(1) span')
const succeded = document.querySelectorAll(' .all_audits span:nth-of-type(1), .infos div:nth-of-type(2) p:nth-of-type(2) span')
const failed = document.querySelectorAll('.all_audits span:nth-of-type(2), .infos div:nth-of-type(2) p:nth-of-type(3) span')
const auditsContainer = document.querySelector('#audits .audits-container')
const svg = document.getElementById('graph');
const chartContainer = document.querySelectorAll('#chart-container');

// logout
const logoutPopup = document.getElementById('logoutPopup');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');
const logoutSpan = document.querySelector('#logoutPopup span');


async function JWTHandler() {

    const res = await checkJWT()

    if (!res) {
        location.pathname = `${root}/index.html`
    }
}

JWTHandler()

const aboutSectionQuery = `
                        user { 
                            email 
                            login
                            firstName
                            lastName
                            auditRatio
                            xp:transactions_aggregate(where:{type:{_eq:"xp"}
                            eventId:{_eq:41}}){
                                aggregate{
                                    sum{
                                        amount
                                    }
                                }
                            }
                        
                            failed: audits_aggregate( where: {auditedAt: {_is_null: false} grade:{_lt:1} }){ 
                                aggregate{
                                    count
                                }
                            }
                            succeded: audits_aggregate( where: {auditedAt: {_is_null: false} grade:{_gte:1} }){ 
                                aggregate{
                                    count
                                }
                            }
                            
                            all_audits:audits_aggregate(where:{auditedAt:{_is_null:false}}){
                                aggregate{
                                    count
                                }
                            }
                        }    
`
const projectsXpQuery = ` 
                    transactionXp:transaction(where:{eventId:{_eq:41} type:{_eq:"xp"}}){   
                        path
                        amount
                    } 
`
let login = null
const auditsQuery = `{
                        audit(where: {auditedAt: {_is_null: false}, auditorLogin: {_eq: "${login}"}}) {
                            group {
                            path
                            members {
                                userLogin
                            }
                            }
                            closureType
                        }
                    }
`

const skills = `
                transactionSkills:transaction(
                distinct_on: type 
                where: { type: { _like: "skill_%" } }
                order_by: [{ type: asc }, { amount: desc }]
                ) {
                type
                amount
                }
                
`

async function getData() {
    const localJWT = localStorage.getItem('jwt')
    if (!localJWT) {
        return false
    }
    const url = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql'
    const query = ` {
                          ${aboutSectionQuery}
                          ${projectsXpQuery}
                          ${skills}

    } `

    /*    
    jwt contains 3 parts
    -header : algo used to generate this token & token type 
    -payload : user info ex: name, role, exp : stores the data u want to trasmit
    -signature to check if the token valid using algos likes HMACSHA256 that takes header + payload + secret key

    token based authentication is stateless

    */
    try {
        const res = await fetch(url, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${localJWT}`
            },
            body: JSON.stringify({ query })
        })

        const data = await res.json()

        spinner.style.display = 'none'
        console.log(data.data.transactionXp);

        listData(data.data)
        getAuditsData(data.data.user[0].login)

        if (data.errors) {
            return false
        }
        return true

    } catch (error) {
        console.log(error);
    }

}

getData()

const listData = (data) => {
    let raw = data.user[0]
    login = raw.login
    const fullName = raw.firstName + " " + raw.lastName
    document.title = fullName

    fillData(profileName, fullName || '-')
    fillData(profileEmail, raw.email || '-')
    fillData(auditRatio, raw.auditRatio ? raw.auditRatio.toFixed(1) : '-')
    fillData(all_audits, raw.all_audits.aggregate.count || '-')
    fillData(xp, (raw.xp.aggregate.sum.amount / 1000).toFixed(0) || '-')
    fillData(succeded, raw.succeded.aggregate.count || '-')
    fillData(failed, raw.failed.aggregate.count || '-')
    document.querySelector('.infos div p:nth-of-type(3) span').textContent = login || '-'
    if (data.transactionXp && data.transactionXp.length >= 1) {

        projectXPData(data.transactionXp)
    } else {
        chartContainer.forEach(elem => {

            elem.querySelector('svg').style.display = 'none'
            elem.appendChild(nodataELem());
        });
    }
    drawBarChart(data.transactionSkills)
}

function fillData(htmlElem, value) {
    htmlElem.forEach(elem => elem.textContent = value)
}

let projects = []


///only the projects /// remove checkpoint modules
function projectXPData(data) {
    projects = []
    let projectName

    data.forEach(elem => {
        ///check for checkpoint
        if (elem.path.search("checkpoint") == -1) {
            projectName = elem.path.split('/')[3]

            if (projectName && projectName.length > 1) {
                elem.amount /= 1000
                elem.path = projectName
                projects.push(elem)
            }

        }
    })
    updateChart(projects)
}

///LOGOUT LOGIC
logoutBtn.onclick = () => logoutPopup.classList.add('display-logout')
cancelBtn.onclick = () => logoutPopup.classList.remove('display-logout')
logoutSpan.onclick = () => logoutPopup.classList.remove('display-logout')

confirmBtn.addEventListener('click', () => {
    alert("Goodbye! Hope to see you soon! 👋");
    logoutPopup.style.display = 'none';
    localStorage.removeItem('jwt')
    location.pathname = `${root}/index.html`
});

async function getAuditsData(username) {
    login = username
    const localJWT = localStorage.getItem('jwt')
    if (!localJWT) {
        return false
    }
    const url = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql'
    ////get audits based on user username
    const query = ` {
        audit(where: {auditedAt: {_is_null: false}, auditorLogin: {_eq: "${login}"}}) {
            auditedAt
            closureType
            group {
                path
                members {
                    userLogin
                }
            }
        }
    }
   `
    try {
        const res = await fetch(url, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${localJWT}`
            },
            body: JSON.stringify({ query })
        })

        const data = await res.json()

        spinner.style.display = 'none'
        listAudits(data.data)

        if (data.errors) {
            return false
        }
        return true

    } catch (error) {
        console.log(error);
    }

}

// Function to update the chart - XP / Projects progression
function updateChart(data) {
    const svgWidth = svg.clientWidth;  // Get the current width of the SVG
    const svgHeight = svg.clientHeight; // Get the current height of the SVG
    const margin = 50;

    // Scaling the data to fit the SVG
    const maxValue = Math.max(...data.map(d => d.amount));
    const xScale = svgWidth - margin * 2;
    const yScale = svgHeight - margin * 2;

    // Calculate the scaling factors
    const xStep = xScale / (data.length - 1); // Space between points on the x-axis
    const yStep = yScale / maxValue; // Scale factor for amount

    // Clear the SVG before redrawing
    svg.innerHTML = '';

    // Create the line path
    let linePath = 'M ' + margin + ',' + (svgHeight - margin - (data[0].amount * yStep));

    // Plot the points and the path
    data.forEach((item, index) => {
        const x = margin + index * xStep;
        const y = svgHeight - margin - (item.amount * yStep);

        // Create the line path data (draw line)
        linePath += ` L ${x},${y}`;

        // Create circle for each point
        const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttribute('cx', x);
        point.setAttribute('cy', y);
        point.setAttribute('r', 6); // Point radius
        point.setAttribute('class', 'point');

        // Add a title (tooltip) to each point to display project name and XP on hover
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${item.path}: ${item.amount} XP`; // Display project name and XP
        point.appendChild(title);  // Append title to point (this shows the tooltip on hover)
        svg.appendChild(point);
    });

    // Draw the line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', linePath);
    line.setAttribute('class', 'line');
    svg.appendChild(line);

    // Draw X-axis (Path labels)
    const xAxisY = svgHeight - margin; // Position of the X-axis at the bottom of the SVG
    const xTickHeight = 10;  // Height of the ticks on the X-axis

    // Draw X-axis line
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin);
    xAxis.setAttribute('y1', xAxisY);
    xAxis.setAttribute('x2', svgWidth - margin);
    xAxis.setAttribute('y2', xAxisY);
    svg.appendChild(xAxis);

    // Add X-axis labels for each path
    data.forEach((item, index) => {
        const x = margin + index * xStep;
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x + 30);
        label.setAttribute('y', xAxisY + xTickHeight + 5);  // Position below the axis
        label.setAttribute('fill', "red");  // Position below the axis
        label.textContent = item.path;

        label.setAttribute('transform-origin', `top left`)
        label.setAttribute('transform', `rotate(45, ${x}, ${xAxisY + xTickHeight})`); // Rotate for readability
        svg.appendChild(label);
    });

    // Draw Y-axis (Value scale)
    const yAxisX = margin; // Position of the Y-axis on the left of the SVG

    // Draw Y-axis line
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', yAxisX);
    yAxis.setAttribute('y1', margin);
    yAxis.setAttribute('x2', yAxisX);
    yAxis.setAttribute('y2', svgHeight - margin);
    svg.appendChild(yAxis);

    // Add Y-axis labels for each value step
    const numSteps = 5; // Number of steps on the Y-axis (you can adjust this)
    for (let i = 0; i <= numSteps; i++) {
        const yValue = (maxValue * (1 - i / numSteps))
        const yPosition = svgHeight - margin - (yValue * yStep); // Position on the SVG

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', yAxisX - 10); // Position left of the Y-axis
        label.setAttribute('y', yPosition);
        label.textContent = yValue.toFixed()
        label.setAttribute('text-anchor', 'end');
        svg.appendChild(label);
    }
}


/////bar-chart  - Highest skills
function drawBarChart(data) {

    // Set up SVG container
    const svg = document.getElementById('bar-chart');  // Ensure you have an SVG element with this ID
    const svgWidth = svg.clientWidth;  // Get the current width of the SVG
    const svgHeight = svg.clientHeight; // Get the current height of the SVG
    const margin = 50;
    const barWidth = svgWidth / data.length - 10;  // Width of each bar (with some padding)

    // Find the max value to scale the bars
    const maxAmount = Math.max(...data.map(item => item.amount));

    // Scaling factors
    const yStep = (svgHeight - margin * 2) / maxAmount; // Scale factor for the height of the bars

    // Clear the SVG before redrawing
    svg.innerHTML = '';

    // Group elements and draw bars
    data.forEach((item, index) => {
        const x = margin + index * (barWidth + 10); // Position each bar with some spacing between them
        const y = svgHeight - margin - (item.amount * yStep); // Y position based on the amount
        const height = item.amount * yStep; // Height of the bar

        // Create a group to hold each rect (bar) and its amount label
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'bar-group');

        // Create a rectangle (bar) for each skill
        const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bar.setAttribute('x', x);
        bar.setAttribute('y', y);
        bar.setAttribute('width', barWidth);
        bar.setAttribute('height', height);
        bar.setAttribute('fill', '#4caf50'); // Color of the bars
        bar.setAttribute('class', 'bar');

        // Add a title (tooltip) to each bar to display skill name and amount on hover
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${item.type}: ${item.amount} XP`; // Tooltip text
        bar.appendChild(title);  // Attach title to the bar

        // Add a text element to display the amount above the bar (hidden by default)
        const amountText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        amountText.setAttribute('x', x + barWidth / 2); // Center the text above the bar
        amountText.setAttribute('y', y - 5); // Position slightly above the bar
        amountText.setAttribute('text-anchor', 'middle');
        amountText.textContent = item.amount;
        amountText.setAttribute('display', 'none'); // Initially hidden

        // Show the amount text when hovering over the bar
        bar.addEventListener('mouseenter', () => {
            amountText.setAttribute('display', 'block');
        });

        // Hide the amount text when the hover ends
        bar.addEventListener('mouseleave', () => {
            amountText.setAttribute('display', 'none');
        });

        // Add the bar and the amount text to the group
        group.appendChild(bar);
        group.appendChild(amountText);

        // Add the group to the SVG
        svg.appendChild(group);
    });

    // Draw X-axis (labels for skills)
    const xAxisY = svgHeight - margin;
    data.forEach((item, index) => {
        const x = margin + index * (barWidth + 10) + barWidth / 2; // Center the label below the bar
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x + 15);
        label.setAttribute('y', xAxisY + 25);  // Position below the axis
        label.textContent = item.type.substring(6);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('transform', `rotate(45, ${x}, ${xAxisY + 10})`); // Rotate for readability
        svg.appendChild(label);
    });

    // Draw X-axis line
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin);
    xAxis.setAttribute('y1', xAxisY);
    xAxis.setAttribute('x2', svgWidth - margin);
    xAxis.setAttribute('y2', xAxisY);
    svg.appendChild(xAxis);

    // Draw Y-axis (XP scale)
    const yAxisX = margin; // Position of the Y-axis
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', yAxisX);
    yAxis.setAttribute('y1', margin);
    yAxis.setAttribute('x2', yAxisX);
    yAxis.setAttribute('y2', svgHeight - margin);
    yAxis.setAttribute('stroke', 'black');
    svg.appendChild(yAxis);

    // Add Y-axis labels for each value step
    const numSteps = 5;
    for (let i = 0; i <= numSteps; i++) {
        const yValue = (maxAmount * (1 - i / numSteps)); // Calculate value for each step
        const yPosition = svgHeight - margin - (yValue * yStep); // Position on the SVG

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', yAxisX - 10); // Position left of the Y-axis
        label.setAttribute('y', yPosition);
        label.textContent = yValue.toFixed(0); // Display values as integers
        label.setAttribute('text-anchor', 'end');
        svg.appendChild(label);
    }
}

function listAudits(data) {
    console.log(data);
    if (!data.audit || data.audit.length < 1) {
        auditsContainer.appendChild(nodataELem())
    } else {

        data.audit.forEach(elem => {
            ///audit container
            let card = document.createElement('div')
            /// succeeded / failed
            card.classList.add(elem.closureType)

            const auditedAt = document.createElement('span')
            auditedAt.textContent = new Date(elem.auditedAt).toLocaleDateString()
            auditedAt.classList.add('auditedAt')
            card.appendChild(auditedAt)

            const projectName = document.createElement('span')
            ///get only the project name
            projectName.textContent = elem.group.path.substring(elem.group.path.lastIndexOf('/') + 1)
            projectName.classList.add('projectName')
            card.appendChild(projectName)

            const members = document.createElement('div')
            members.classList.add('members')

            elem.group.members.forEach(mem => {
                let span = document.createElement('span')
                span.textContent = mem.userLogin
                members.appendChild(span)
            })
            card.appendChild(members)
            auditsContainer.appendChild(card)

        })
    }
}

document.querySelector('#audits>button').onclick = (a) => {
    let show = auditsContainer.classList.toggle('show')
    a.target.textContent = show ? 'show less' : 'show more'
}

function nodataELem() {

    const nodata = document.createElement('div')
    nodata.classList.add('nodata')
    const span = document.createElement('span')
    span.textContent = "NO DATA"

    nodata.appendChild(span)
    return nodata
}