// Sample data
const data = [

    {
        "project_name": "first",
        "finish_date": "0000-00-00",
        "points": 0
    },
    { "project_name": "P : [A]", "finish_date": "2024-01-15", "points": 80 },
    { "project_name": "P : [B]", "finish_date": "2024-02-20", "points": 95 },
    { "project_name": "P : [C]", "finish_date": "2024-03-10", "points": 70 },
    { "project_name": "P : [D]", "finish_date": "2024-04-05", "points": 85 },
    { "project_name": "P : [E]", "finish_date": "2024-05-12", "points": 90 },
    { "project_name": "P : [F]", "finish_date": "2024-06-18", "points": 75 },
    { "project_name": "P : [G]", "finish_date": "2024-07-22", "points": 60 },
    { "project_name": "P : [H]", "finish_date": "2024-08-30", "points": 100 },
    { "project_name": "P : [I]", "finish_date": "2024-09-14", "points": 80 },
    { "project_name": "P : [J]", "finish_date": "2024-10-01", "points": 95 }
];

const svg = document.getElementById("barGraph");
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 500 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;


// Setting the SVG container's width and height
svg.setAttribute('width', width + margin.left + margin.right);
svg.setAttribute('height', height + margin.top + margin.bottom);

// Create a group element to hold all graph elements
const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
svg.appendChild(g);

// Find the max points value to scale the bars
const maxPoints = Math.max(...data.map(d => d.points));

// Set the bar width and padding
const barWidth = width / data.length;
const barPadding = 5;

// Add Y-axis line (left side of the graph)
const yAxisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
yAxisLine.setAttribute("x1", 0);
yAxisLine.setAttribute("y1", 0);
yAxisLine.setAttribute("x2", 0);
yAxisLine.setAttribute("y2", height);
yAxisLine.setAttribute("stroke", "red");
yAxisLine.setAttribute("stroke-width", 2);
g.appendChild(yAxisLine);

// Add X-axis line (bottom of the graph)
const xAxisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
xAxisLine.setAttribute("x1", 0);
xAxisLine.setAttribute("y1", height);
xAxisLine.setAttribute("x2", width);
xAxisLine.setAttribute("y2", height);
xAxisLine.setAttribute("stroke", "red");
xAxisLine.setAttribute("stroke-width", 2);
g.appendChild(xAxisLine);

// Add Y-axis label
const yAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
yAxisLabel.setAttribute("x", -margin.left / 2);  // Position to the left of the graph
yAxisLabel.setAttribute("y", height / 2);  // Center vertically
yAxisLabel.setAttribute("text-anchor", "middle");
yAxisLabel.textContent = "XP";
g.appendChild(yAxisLabel);

// Add X-axis label
const xAxisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
xAxisLabel.setAttribute("x", width / 2);  // Center horizontally
xAxisLabel.setAttribute("y", height + 30);  // Place just below the graph
xAxisLabel.setAttribute("text-anchor", "middle");
xAxisLabel.textContent = "Project Name";
g.appendChild(xAxisLabel);


// Create the bars
data.forEach((d, i) => {

    const barHeight = (d.points / maxPoints) * height;
    const barG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    barG.setAttribute('class', 'barG')
    // Create a rectangle for each project
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", i * barWidth + barPadding);
    rect.setAttribute("y", height - barHeight - 5);
    rect.setAttribute("width", barWidth - barPadding);
    rect.setAttribute("height", barHeight);
    barG.appendChild(rect)

    // Add text labels for points above each bar
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", i * barWidth + barWidth / 2);
    text.setAttribute("y", height - barHeight - 8);
    text.setAttribute("opacity", 0);

    text.textContent = d.points;
    barG.appendChild(text)
    g.appendChild(barG);

});

// Add X-axis labels (project names)
data.forEach((d, i) => {
    const xAxisText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xAxisText.setAttribute("x", i * barWidth + barWidth / 2);
    xAxisText.setAttribute("y", height + 15);
    xAxisText.setAttribute("text-anchor", "middle");
    xAxisText.textContent = d.project_name;
    g.appendChild(xAxisText);
});


//----------//----------//----------//----------
//----------//----------//----------//----------


const svg2 = document.getElementById("barGraph2");


// Setting the SVG container's width and height
svg2.setAttribute('width', width + margin.left + margin.right);
svg2.setAttribute('height', height + margin.top + margin.bottom);

// Create a group element to hold all graph elements
const g2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
g2.setAttribute('transform', `translate(${margin.left},${margin.top})`);
svg2.appendChild(g2);

// Find the max points value to scale the bars

// Set the bar width and padding

// Add Y-axis line (left side of the graph)
const yAxisLine2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
yAxisLine2.setAttribute("x1", 0);
yAxisLine2.setAttribute("y1", 0);
yAxisLine2.setAttribute("x2", 0);
yAxisLine2.setAttribute("y2", height);
yAxisLine2.setAttribute("stroke", "yellow");
yAxisLine2.setAttribute("stroke-width", 2);
g2.appendChild(yAxisLine2);

// Add X-axis line (bottom of the graph)
const xAxisLine2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
xAxisLine2.setAttribute("x1", 0);
xAxisLine2.setAttribute("y1", height);
xAxisLine2.setAttribute("x2", width);
xAxisLine2.setAttribute("y2", height);
xAxisLine2.setAttribute("stroke", "yellow");
xAxisLine2.setAttribute("stroke-width", 2);
g2.appendChild(xAxisLine2);

// Add Y-axis label
const yAxisLabel2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
yAxisLabel2.setAttribute("x", -margin.left / 2);  // Position to the left of the graph
yAxisLabel2.setAttribute("y", height / 2);  // Center vertically
yAxisLabel2.setAttribute("text-anchor", "middle");
yAxisLabel2.textContent = "Points";
g2.appendChild(yAxisLabel2);

// Add X-axis label
const xAxisLabel2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
xAxisLabel2.setAttribute("x", width / 2);  // Center horizontally
xAxisLabel2.setAttribute("y", height + 30);  // Place just below the graph
xAxisLabel2.setAttribute("text-anchor", "middle");
xAxisLabel2.textContent = "Project Name";
g2.appendChild(xAxisLabel2);


let total = 0
// Create the bars
data.forEach((d, i) => {

    total += d.points
    const barHeight = (d.points / maxPoints) * height;
    const barG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    barG.setAttribute('class', 'barG')
    // Create a rectangle for each project
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", i * barWidth + barPadding);
    rect.setAttribute("y", height - barHeight - 5);
    rect.setAttribute("width", 5);
    rect.setAttribute("height", 5);
    barG.appendChild(rect)

    // Add text labels for points above each bar
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", i * barWidth + barWidth / 2);
    text.setAttribute("y", height - barHeight - 8);
    text.setAttribute("opacity", 0);

    text.textContent = d.points;
    barG.appendChild(text)

    ///draw line
    // <line x1="0" y1="0" x2="100" y2="20"/>
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", d.points);
    line.setAttribute("y1", d.points);
    line.setAttribute("x2", d.points);
    line.setAttribute("y2", d.points);
    line.setAttribute("stroke", "red");

    g2.appendChild(line);
    g2.appendChild(barG);

});

// Add X-axis labels (project names)
data.forEach((d, i) => {
    const xAxisText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xAxisText.setAttribute("x", i * barWidth + barWidth / 2);
    xAxisText.setAttribute("y", height + 15);
    xAxisText.setAttribute("text-anchor", "middle");
    xAxisText.textContent = d.project_name;
    g2.appendChild(xAxisText);
});

///

  // List of technologies with their progress percentage and colors
  const progressData = [
    { tech: 'Go', prog: 30, color: '#FF5733' },
    { tech: 'JavaScript', prog: 20, color: '#33FF57' },
    { tech: 'HTML', prog: 10, color: '#3357FF' },
    { tech: 'CSS', prog: 15, color: '#FFD700' },
    { tech: 'Unix', prog: 5, color: '#9B59B6' },
    { tech: 'Docker', prog: 10, color: '#1ABC9C' },
    { tech: 'SQL', prog: 10, color: '#E74C3C' }
  ];
  
  // Calculate total progress
  const totalProgress = progressData.reduce((sum, item) => sum + item.prog, 0);
  let currentAngle = 0;
  const radius = 150; // The radius of the pie chart
  const svgContainer = document.querySelector('.pie');
  const tooltip = document.querySelector('.tooltip');
  const legend = document.querySelector('.legend');
  
  // Loop through each technology and draw a slice
  progressData.forEach(({ tech, prog, color }) => {
    const percentage = (prog / totalProgress) * 100;
    const angle = (prog / totalProgress) * 360;
    const midAngle = currentAngle + (angle / 2);
    
    // Calculate coordinates using trigonometry
    const x1 = Math.cos(Math.PI * currentAngle / 180) * radius;
    const y1 = Math.sin(Math.PI * currentAngle / 180) * radius;
    const x2 = Math.cos(Math.PI * (currentAngle + angle) / 180) * radius;
    const y2 = Math.sin(Math.PI * (currentAngle + angle) / 180) * radius;
    
    // Create a path for each slice
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`);
    path.setAttribute('fill', color);
    path.setAttribute('data-tech', tech);
    path.setAttribute('data-percentage', percentage.toFixed(1));
    
    // Add hover effect and tooltip 
    path.addEventListener('mouseover', (e) => {
      path.setAttribute('opacity', '0.8');
      const tech = path.getAttribute('data-tech');
      const percentage = path.getAttribute('data-percentage');
      tooltip.textContent = `${tech}: ${percentage}%`;
      tooltip.style.opacity = '1';
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY + 10}px`;
    });
    
    path.addEventListener('mousemove', (e) => {
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY + 10}px`;
    });
    
    path.addEventListener('mouseout', () => {
      path.setAttribute('opacity', '1');
      tooltip.style.opacity = '0';
    });
    
    svgContainer.appendChild(path);
    
    // Add text labels for larger slices
    if (angle > 30) {
      const labelX = Math.cos(Math.PI * midAngle / 180) * (radius * 0.7);
      const labelY = Math.sin(Math.PI * midAngle / 180) * (radius * 0.7);
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', labelX);
      text.setAttribute('y', labelY);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', '14');
      text.setAttribute('font-weight', 'bold');
      text.textContent = `${percentage.toFixed(0)}%`;
      
      svgContainer.appendChild(text);
    }
    
    // Create legend item
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;
    
    const techText = document.createElement('div');
    techText.textContent = `${tech}: ${percentage.toFixed(1)}%`;
    
    legendItem.appendChild(colorBox);
    legendItem.appendChild(techText);
    legend.appendChild(legendItem);
    
    // Update the current angle for the next slice
    currentAngle += angle;
  });