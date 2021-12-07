mapChart = () => {
  var mapChart = d3.select("#mapChart"),
    width = mapChart.attr("width") - 150,
    height = mapChart.attr("height") - 150;

  var x = d3.scaleBand().range([0, width]).padding(0.4),
    y = d3.scaleLinear().range([height, 0]);

  var g = mapChart.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")")

  g
    .append("text")
    .attr("x", (width / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Death by Date");

  d3.csv("data/deathdays.csv", function (data) {

    x.domain(data.map(function (d) {
      return d.date;
    }));
    y.domain([0, Math.max.apply(Math, data.map(function (d) {
      return d.deaths;
    }))]);

    g
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", -10)
      .attr("dy", -7)
      .attr("transform", "rotate(-90)")

    g
      .append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")


    g
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", "grey")
      .on("mouseover", function (d) {
        d3.selectAll(".death")
          .attr("visibility", "hidden")
          .filter(function (d2) {
            return d2.deathdate == d.date;
          })
          .attr("visibility", "visible");

        d3.select(this)
          .attr("fill", "#654321")
          .attr("y", function (d) {
            return y(d.deaths) - 10;
          })
          .attr("height", function (d) {
            return height - y(d.deaths) + 10;
          })
          .append("title")
          .text(function (d) {
            return (
              (d.deaths == 1 ? "Total Death" : "Total Deaths") + " on " + d.date + ":" + " " + d.deaths
            );
          });

      })
      .on("mouseout", function (d) {
        d3.select(this).attr('fill', 'grey');
        d3.selectAll(".death")
          .attr("visibility", "hidden")
          .attr("fill", "black")

        d3.select(this)
          .attr('width', x.bandwidth())
          .attr("y", function (d) {
            return y(d.deaths);
          })
          .attr("height", function (d) {
            return height - y(d.deaths);
          });

      })
      .attr("x", function (d) {
        return x(d.date);
      })
      .attr("y", function (d) {
        return y(d.deaths);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(d.deaths);
      })

  });

}

barChart = () => {
  var barChart = d3.select("#barChart"),
    width = barChart.attr("width") - 180,
    height = barChart.attr("height") - 180;

  barChart.append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", 40)
    .attr("y", 60)
    .text(" Death By Gender")
    .style("font-weight", "bold")
    .style('font-size', 20)

  var x = d3.scaleBand().range([0, width]).padding(0.4),
    y = d3.scaleLinear().range([height, 0]);

  var g = barChart.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

  d3.csv("data/By_Gender.csv", function (error, data) {
    if (error) {
      throw error;
    }

    x.domain(data.map(function (d) {
      return d.gender;
    }));
    y.domain([0, d3.max(data, function (d) {
      return d.deaths;
    })]);

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))


    g.append("g")
      .call(d3.axisLeft(y).tickFormat(function (d) {
        return "" + d;
      }).ticks(10))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -10)
      .attr("x", -50)
      .attr("font-size", 16)
      .attr("dy", -35)
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Number of Deaths");

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", "grey")
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut)
      .attr("x", function (d) {
        return x(d.gender);
      })
      .attr("y", function (d) {
        return y(d.deaths);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(d.deaths);
      });
  });


  function onMouseOver(d, i) {
    d3.select(this).attr('fill', d.gender == "male" ? "blue" : "red");

    d3.selectAll(".death")
      .attr("visibility", "hidden")
      .filter(function (d2) {
        return d.gender == "male" ? d2.gender == "male" : d2.gender == "female";
      })
      .attr("visibility", "visible")
      .attr("fill", d.gender == "male" ? "blue" : "red")



    g.append("text")
      .attr('class', 'val')
      .attr('x', function () {
        return x(d.gender);
      })
      .attr('y', function () {
        return y(d.deaths) - 5;
      })
      .text(function () {
        return ['' + d.deaths];
      });
  }


  function onMouseOut(d, i) {

    d3.select(this).attr('fill', 'grey');
    d3.selectAll(".death")
      .attr("visibility", "hidden")
      .attr("fill", "black")

    d3.selectAll('.val')
      .remove()
  }
}

pieChart = () => {

  var pieChart = d3.select("#pieChart"),
    width = pieChart.attr("width"),
    height = pieChart.attr("height"),
    radius = Math.min(width, height) / 2;

  var g = pieChart.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c', 'rgb(223,151,172)']);


  var pie = d3.pie().value(function (d) {
    return d.deaths;
  });

  var path = d3.arc()
    .outerRadius(radius - 15)
    .innerRadius(0);

  var label = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius - 110);

  d3.csv("data/By_Age.csv", function (error, data) {
    if (error) {
      throw error;
    }
    var arc = g.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

    arc.append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        return color(d.data.age);
      });

    arc.append("text")
      .attr("transform", function (d) {
        return "translate(" + label.centroid(d) + ")";
      })
      .text(function (d) {
        return "[" + d.data.age + "]" + " " + d.data.deaths;
      })

    arc.on("mouseover", function (d) {
        let color = ""
        d3.selectAll(".death")
          .attr("visibility", "hidden")
          .filter(function (d2) {
            if (d.data.age == "0-10") {
              color = "#4daf4a";
              return d2.age == 0;
            } else if (d.data.age == "11-20") {
              color = "#377eb8";
              return d2.age == 1;
            } else if (d.data.age == "21-40") {
              color = "#ff7f00";
              return d2.age == 2;
            } else if (d.data.age == "41-60") {
              color = "#984ea3"
              return d2.age == 3;
            } else if (d.data.age == "61-80") {
              color = "#e41a1c";
              return d2.age == 4;
            } else if (d.data.age == ">80") {
              color = "rgb(223,151,172)";
              return d2.age == 5;
            }

          })
          .attr("visibility", "visible")
          .attr("fill", color)

        d3.select(this)
          .transition()
          .duration(400)
          .attr("transform", "scale(1.06)")
      })
      .on("mouseout", function () {
        d3.selectAll(".death")
          .attr("visibility", "hidden")
          .attr("fill", "black")

        d3.select(this)
          .transition()
          .duration(400)
          .attr("transform", "scale(1)")
      })

  });

  pieChart.append("g")
    .attr("transform", "translate(" + (width / 2 - 180) + "," + 12 + ")")
    .append("text")
    .attr("y", 5)
    .attr("x", -20)
    .text("Death By Age")
    .attr("class", "title")
    .style("font-weight", "bold")
    .style('font-size', 18)

}

// To Create Chart
let map = d3.select("svg#map");

let horizontalScaling = d3.scaleLinear()
  .domain([3, 20])
  .range([0, 500]);
let verticalScaling = d3.scaleLinear()
  .domain([3, 20])
  .range([500, 0]);

let deathData = [];

d3.csv("data/deaths_age_sex.csv", function (data) {
  data.forEach((e) => {
    deathData.push({
      x: e.x,
      y: e.y,
      age: parseInt(e.age),
      gender: e.gender == 1 ? "female" : "male",
    })

  })
});

d3.csv("data/deathdays.csv", function (data) {
  let count = 0;
  data.forEach(function (e) {
    for (let i = 0; i < e.deaths; i++) {
      deathData[count].deathdate = e.date;
      count++;
    }
  })
  createDots();
});

createDots = () => {
  map
    .selectAll(".death")
    .data(deathData)
    .enter()
    .append("circle")
    .attr("class", "death")
    .attr("cx", function (d) {
      return horizontalScaling(d.x);
    })
    .attr("cy", function (d) {
      return verticalScaling(d.y);
    })
    .attr("fill", "black")
    .append("title")
    .text(function (d) {
      return ("DEAD PEOPLE")
    })
}

d3.json("data/streets.json", function (data) {

  for (let i = 0; i < data.length; i++) {

    let createSteeetPath = d3
      .line()
      .x(function (d) {
        return horizontalScaling(d.x);
      })
      .y(function (d) {
        return verticalScaling(d.y);
      })
      .curve(d3.curveLinear);

    map
      .append("path")
      .attr("d", createSteeetPath(data[i]))
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1)

  }

  map
    .append("text")
    .attr("x", 360)
    .attr("y", 237)
    .style("font-size", 12)
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .style("text-anchor", "start")
    .attr("transform", "rotate(75 190 30)")
    .text("CEORGE STREET")
    .append("title")
    .text(function (d) {
      return ("CEORGE STREET")
    });

  map
    .append("text")
    .attr("x", 210)
    .attr("y", 200)
    .style("font-size", 15)
    .style("text-anchor", "start")
    .attr("transform", "rotate(0)")
    .attr("fill", "orange")
    .attr("stroke-width", "none")
    .attr("font-weight", "bold")
    .text("WORKHOUSE")
    .append("title")
    .text(function (d) {
      return ("WORKHOUSE")
    });

  map
    .append("text")
    .attr("x", 420)
    .attr("y", -45)
    .style("font-size", 15)
    .attr("font-weight", "bold")
    .style("text-anchor", "start")
    .attr("transform", "rotate(75 190 20)")
    .attr("fill", "orange")
    .attr("stroke-width", "none")
    .text("BREWERY")
    .append("title")
    .text(function (d) {
      return ("BREWERY")
    });

  map
    .append("text")
    .attr("x", 150)
    .attr("y", 130)
    .style("font-size", 12)
    .attr("fill", "black")
    .attr("font-weight", "bold")
    .style("text-anchor", "start")
    .attr("transform", "rotate(-25 100 -30)")
    .text("OXFORD STREET")
    .append("title")
    .text(function (d) {
      return ("OXFORD STREET")
    });

  map
    .append("text")
    .attr("x", 20)
    .attr("y", 400)
    .style("font-size", 12)
    .attr("font-weight", "bold")
    .style("text-anchor", "start")
    .attr("fill", "black")
    .attr("transform", "rotate(-35 120 -20)")
    .text("BREWER STREET")
    .append("title")
    .text(function (d) {
      return ("BREWER STREET")
    });

  map
    .append("text")
    .attr("x", 230)
    .attr("y", 430)
    .attr("font-size", 13)
    .attr("fill", "green")
    .style("text-anchor", "start")
    .attr("transform", "rotate(0)")
    .attr("font-weight", "bold")
    .text("REGENTS QUADRANT")
    .append("title")
    .text(function (d) {
      return ("REGENTS QUADRANT")
    });

  map
    .append("text")
    .attr("x", 300)
    .attr("y", -200)
    .style("font-size", 13)
    .style("text-anchor", "start")
    .attr("transform", "rotate(75 190 20)")
    .attr("stroke-width", "none")
    .attr("font-weight", "bold")
    .attr("fill", "green")
    .text("SOHO SQUARE")
    .append("title")
    .text(function (d) {
      return ("SOHO SQUARE")
    });
  map
    .append("text")
    .attr("x", 400)
    .attr("y", -170)
    .style("font-size", 12)
    .style("text-anchor", "start")
    .attr("transform", "rotate(75 190 20)")
    .attr("stroke-width", "none")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .text("DEAN STREET")
    .append("title")
    .text(function (d) {
      return ("DEAN STREET")
    });
  map
    .append("text")
    .attr("x", 540)
    .attr("y", -120)
    .style("font-size", 12)
    .style("text-anchor", "start")
    .attr("transform", "rotate(75 190 20)")
    .attr("fill", "black")
    .attr("stroke-width", "none")
    .attr("font-weight", "bold")
    .text("RUPERT STREET")
    .append("title")
    .text(function (d) {
      return ("RUPERT STREET")
    });
  map
    .append("text")
    .attr("x", 50)
    .attr("y", 230)
    .style("font-size", 12)
    .style("text-anchor", "start")
    .attr("transform", "rotate(-20 -20 0)")
    .attr("stroke-width", "none")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .text("GREAT MARLBOROUGH STREET")
    .append("title")
    .text(function (d) {
      return ("GREAT MARLBOROUGH STREET")
    });
  map
    .append("text")
    .attr("x", 500)
    .attr("y", 190)
    .style("font-size", 10)
    .style("text-anchor", "start")
    .attr("transform", "rotate(60 160 20)")
    .attr("stroke-width", "none")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .text("SACKVILLE STREET")
    .append("title")
    .text(function (d) {
      return ("SACKVILLE STREET")
    });

  d3.csv("data/pumps.csv", function (data) {
    map
      .selectAll(".pump")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "pump")
      .attr("r", 8)
      .attr("cx", function (d) {
        return horizontalScaling(d.x);
      })
      .attr("cy", function (d) {
        return verticalScaling(d.y);
      })
      .append("title")
      .text(function (d) {
        return (
          "Pump"
        );
      });
  });

  mapChart();
  barChart();
  pieChart();
});

var svg = map
  .attr("width", "100%")
  .attr("height", "100%")
  .call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform)
  }))