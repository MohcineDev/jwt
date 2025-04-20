const logoutBtn = document.querySelector('.logout')
async function rr() {

    const tf = await checkJWT()

    if (!tf) {
        location.href = '/login.html'
    }
}

rr()
const aboutSectionQuery = `{
                        user { 
                            email 
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
                    transaction(where:{eventId:{_eq:41} type:{_eq:"xp"}}){   
                        path
                        amount
                    } 
`

async function getAboutData() {
    const localJWT = localStorage.getItem('jwt')
    if (!localJWT) {
        return false
    }
    const url = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql'
    const query = ` 
                          ${aboutSectionQuery}
                          ${projectsXpQuery}
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

        console.log(data);
        listData(data.data)

        if (data.errors) {
            return false
        }
        return true

    } catch (error) {

        console.log(error);
    }
}
getAboutData()

const listData = (data) => {
    let raw = data.user[0]
    document.querySelector('.profile-name').textContent = raw.firstName + " " + raw.lastName
    document.querySelector('.email').textContent = raw.email
    document.querySelector('.xp span').textContent = raw.xp.aggregate.sum.amount / 1000
    document.querySelector('.auditRatio  span').textContent = raw.auditRatio.toFixed(1)
    document.querySelector('.audits span').textContent = raw.all_audits.aggregate.count
    document.querySelector('.all_audits span:nth-of-type(1)').textContent = raw.succeded.aggregate.count
    document.querySelector('.all_audits span:nth-of-type(2)').textContent = raw.failed.aggregate.count

    projectXPData(data.transaction)
}
let projects = []

function projectXPData(data) {
    console.log(data);
    projects = []
    let projectName

    data.forEach(elem => {
        if (elem.path.search("checkpoint") == -1) {
            projectName = elem.path.split('/')[3]

            if (projectName && projectName.length > 1) {
                elem.amount /= 1000
                elem.path = projectName
                projects.push(elem)
            }

        }
    })
    console.log(projects);
    updateChart(projects)
}

// logout
const logoutPopup = document.getElementById('logoutPopup');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

logoutBtn.onclick = () => logoutPopup.style.display = 'block';

cancelBtn.addEventListener('click', () => logoutPopup.style.display = 'none');

confirmBtn.addEventListener('click', () => {
    alert("Goodbye! Hope to see you soon! 👋");
    logoutPopup.style.display = 'none';
    localStorage.removeItem('jwt')
    location.href = '/login.html'
});


// Function to update the chart
function updateChart(data) {
    const svg = document.getElementById('graph');
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
    // Add the word "Project" at the end of the X-axis
    // const projectLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    // projectLabel.setAttribute('x', svgWidth - margin + 20); // Position at the end of X-axis
    // projectLabel.setAttribute('y', xAxisY + xTickHeight);  // Position just below the axis
    // projectLabel.textContent = 'Project';
    // svg.appendChild(projectLabel);

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