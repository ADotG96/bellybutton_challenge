// Build the metadata panel
let data
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    console.log(data);
    // get the metadata field
    let metadata = data.metadata;
    console.log(metadata);

    // Filter the metadata for the object with the desired sample number
    let filtered_data = metadata.filter(selectedsample => selectedsample['id'] == sample);
    console.log("filtered data", filtered_data);

    // Use d3 to select the panel with id of `#sample-metadata`
    let demopanel = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    demopanel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let i = 0; i < filtered_data.length; i++) {
      let item = filtered_data[i];
      Object.entries(item).forEach(([key, value]) => {
        let row = demopanel.append("h5")
        row.text(`${key}: ${value}`);
      });
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sampledata = data.samples;
    console.log(sampledata)

    // Filter the samples for the object with the desired sample number
    let filtered_sampledata = sampledata.filter(selectedsam => selectedsam['id'] == sample);
    console.log("filtered sample data", filtered_sampledata);

    // Get the otu_ids, otu_labels, and sample_values
    let sample_values = sampledata[0].sample_values;
    let otu_ids = sampledata[0].otu_ids;
    let otu_labels = sampledata[0].otu_labels;


    // Build a Bubble Chart
    const colorScale = [
      [0, 'rgb(49,54,149)'],
      [0.5, 'rgb(50,205,50)'],
      [1, 'rgb(165,0,38)']  
    ];
    
    bubble_trace = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
        color: otu_ids,
        colorscale: colorScale,
        size: sample_values
      }
    };
    // Render the Bubble Chart
    bubble_layout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1300,
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria", range: [0,250]}
    };

    Plotly.newPlot('bubble', [bubble_trace], bubble_layout);
  

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yAxis = otu_ids.map(id => `OTU ${id}`).slice(0,10);
    let barotu_labels = otu_labels.slice(0,10);
    let barsample_values = sample_values.slice(0,10)


    // Build a Bar Chart
    let bar_trace = {
      x: barsample_values.reverse(),
      y: yAxis.reverse(),
      text: barotu_labels.reverse(),
      marker: {color: 'setosa'},
      type: "bar",
      orientation: "h"
    }
    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart
    let layout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {title: 'Number of Bacteria', range: [0,160]}
      //   type:'category',
      //   tickmode: 'linear',
      //   tick0: 0}
    };
    Plotly.newPlot('bar', [bar_trace], layout);
  })
}
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((d) => {

    // Get the names field
    data = d
    let namesfield = d['names'];
    // Use d3 to select the dropdown with id of `#selDataset`
    handle = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    namesfield.forEach((sample) => {
      handle
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = namesfield[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  console.log('new Sample', newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
};

// Initialize the dashboard
init();
