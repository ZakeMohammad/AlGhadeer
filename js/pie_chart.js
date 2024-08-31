$(function () {
    let MyDataFromAPi = [];
    var data = [],
        series = MyDataFromAPi[0];

        fetch('https://rashadalabbasy-001-site1.ctempurl.com/api/AdminPanelContent/GetRatios', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(apiData => {
           
            if (apiData && apiData.length === 5) {
             
                data = [
                    { label: "Pending ", data: apiData[0] },
                    { label: "Confirmed ", data: apiData[1] },
                    { label: "Active ", data: apiData[2] },
                    { label: "Completed ", data: apiData[3] },
                    { label: "Cancelled ", data: apiData[4] }
                ];
    
           
            
            } else {
                console.error("Unexpected data format from API:", apiData);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    for (var i = 0; i < 5; i++) {
        data[i] = {
            label: "Series" + (i + 1),
            data: MyDataFromAPi[i]
        };
    }

    console.log('From not api ' + data);

    var placeholder = $("#placeholder");

    $("#example-1").click(function () {
        placeholder.unbind();

        $("#title").text("Default pie chart");
        $("#description").text("The default pie chart with no options set.");

        $.plot(placeholder, data, {
            series: {
                pie: {
                    show: true
                }
            }
        });

        setCode([
            "$.plot('#placeholder', data, {",
            "    series: {",
            "        pie: {",
            "            show: true",
            "        }",
            "    }",
            "});"
        ]);
    });

    $("#example-2").click(function () {
        placeholder.unbind();

        $("#title").text("Default without legend");
        $("#description").text("The default pie chart when the legend is disabled. Since the labels would normally be outside the container, the chart is resized to fit.");

        $.plot(placeholder, data, {
            series: {
                pie: {
                    show: true
                }
            },
            legend: {
                show: false
            }
        });

        setCode([
            "$.plot('#placeholder', data, {",
            "    series: {",
            "        pie: {",
            "            show: true",
            "        }",
            "    },",
            "    legend: {",
            "        show: false",
            "    }",
            "});"
        ]);
    });

    $("#example-3").click(function () {
        placeholder.unbind();

        $("#title").text("Custom Label Formatter");
        $("#description").text("Added a semi-transparent background to the labels and a custom labelFormatter function.");

        $.plot(placeholder, data, {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    label: {
                        show: true,
                        radius: 1,
                        formatter: labelFormatter,
                        background: {
                            opacity: 0.8
                        }
                    }
                }
            },
            legend: {
                show: false
            }
        });

        setCode([
            "$.plot('#placeholder', data, {",
            "    series: {",
            "        pie: {",
            "            show: true,",
            "            radius: 1,",
            "            label: {",
            "                show: true,",
            "                radius: 1,",
            "                formatter: labelFormatter,",
            "                background: {",
            "                    opacity: 0.8",
            "                }",
            "            }",
            "        }",
            "    },",
            "    legend: {",
            "        show: false",
            "    }",
            "});"
        ]);
    });

    $("#example-4").click(function () {
        placeholder.unbind();

        $("#title").text("Label Radius");
        $("#description").text("Slightly more transparent label backgrounds and adjusted the radius values to place them within the pie.");

        $.plot(placeholder, data, {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    label: {
                        show: true,
                        radius: 3 / 4,
                        formatter: labelFormatter,
                        background: {
                            opacity: 0.5
                        }
                    }
                }
            },
            legend: {
                show: false
            }
        });

        setCode([
            "$.plot('#placeholder', data, {",
            "    series: {",
            "        pie: {",
            "            show: true,",
            "            radius: 1,",
            "            label: {",
            "                show: true,",
            "                radius: 3/4,",
            "                formatter: labelFormatter,",
            "                background: {",
            "                    opacity: 0.5",
            "                }",
            "            }",
            "        }",
            "    },",
            "    legend: {",
            "        show: false",
            "    }",
            "});"
        ]);
    });

    $("#example-5").click(function () {
        placeholder.unbind();

        $("#title").text("Label Styles #1");
        $("#description").text("Semi-transparent, black-colored label background.");

        $.plot(placeholder, data, {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    label: {
                        show: true,
                        radius: 3 / 4,
                        formatter: labelFormatter,
                        background: {
                            opacity: 0.5,
                            color: "#000"
                        }
                    }
                }
            },
            legend: {
                show: false
            }
        });

        setCode([
            "$.plot('#placeholder', data, {",
            "    series: {",
            "        pie: { ",
            "            show: true,",
            "            radius: 1,",
            "            label: {",
            "                show: true,",
            "                radius: 3/4,",
            "                formatter: labelFormatter,",
            "                background: { ",
            "                    opacity: 0.5,",
            "                    color: '#000'",
            "                }",
            "            }",
            "        }",
            "    },",
            "    legend: {",
            "        show: false",
            "    }",
            "});"
        ]);
    });

    $("#example-6").click(function () {
        placeholder.unbind();

        $("#title").text("Label Styles #2");
        $("#description").text("Semi-transparent, black-colored label background placed at pie edge.");

        $.plot(placeholder, data, {
            series: {
                pie: {
                    show: true,
                    radius: 3 / 4,
                    label: {
                        show: true,
                        radius: 3 / 4,
                        formatter: labelFormatter,
                        background: {
                            opacity: 0.5,
                            color: "#000"
                        }
                    }
                }
            },
            legend: {
                show: false
            }
        });

        setCode([
            "$.plot('#placeholder', data, {",
            "    series: {",
            "        pie: {",
            "            show: true,",
            "            radius: 3/4,",
            "            label: {",
            "                show: true,",
            "                radius: 3/4,",
            "                formatter: labelFormatter,",
            "                background: {",
            "                    opacity: 0.5,",
            "                    color: '#000'",
            "                }",
            "            }",
            "        }",
            "    },",
            "    legend: {",
            "        show: false",
            "    }",
            "});"
        ]);
    });

    $("#example-7").click(function () {
        placeholder.unbind();

        $("#title").text("Hidden Labels");
        $("#description").text("Labels can be hidden if the slice is less than a given percentage of the pie (10% in this case).");

        $.plot(placeholder, data, {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    label: {
                        show: true,
                        radius: 2 / 3,
                        formatter: labelFormatter,
                        threshold: 0.1
                    }
                }
            },
            legend: {
                show: false
            }
        });

        setCode([
            "$.plot('#placeholder', data, {",
            "    series: {",
            "        pie: {",
            "            show: true,",
            "            radius: 1,",
            "            label: {",
            "                show: true,",
            "                radius: 2/3,",
            "                formatter: labelFormatter,",
            "                threshold: 0.1",
            "            }",
            "        }",
            "    },",
            "    legend: {",
            "        show: false",
            "    }",
            "});"
        ]);
    });

    $("#example-8").click(function () {
        placeholder.unbind();

        $("#title").text("Combined Slice");
        $("#description").text("Multiple slices less than a given percentage (5% in this case) of the pie can be combined into a single, larger slice.");

        $.plot(placeholder, data, {
            series: {
                pie: {
                    show: true,
                    combine: {
                        color: "#999",
                        threshold: 0.05
                    }
                }
            },
            legend: {
                show: false
            }
        });

        setCode([
            "$.plot('#placeholder', data, {",
            "    series: {",
            "        pie: {",
            "            show: true,",
            "            combine: {",
            "                color: '#999',",
            "                threshold: 0.05",
            "            }",
            "        }",
            "    },",
            "    legend: {",
            "        show: false",
            "    }",
            "});"
        ]);
    });

    $("#example-9").click(function () {
        placeholder.unbind();

        $("#title").text("Rectangular Pie");
        $("#description").text("The radius can also be set to a specific size (even larger than the container itself).");

        $.plot(placeholder, data, {
            series: {
                pie: {
                    show: true,
                    radius: 500,
                    label: {
                        show: true,
                        formatter: labelFormatter,
                        threshold: 0.1
                    }
                }
            },
            legend: {
                show: false
            }
        });

        setCode([
            "$.plot('#placeholder', data, {",
            "    series: {",
            "        pie: {",
            "            show: true,",
            "            radius: 500,",
            "            label: {",
            "                show: true,",
            "                formatter: labelFormatter,",
            "                threshold: 0.1",
            "            }",
            "        }",
            "    },",
            "    legend: {",
            "        show: false",
            "    }",
            "});"
        ]);
    });

    $("#example-10").click(function () {
        placeholder.unbind();

        $("#title").text("Tilted Pie");
        $("#description").text("The pie can be tilted at an angle.");

        $.plot(placeholder, data, {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    tilt: 0.5,
                    label: {
                        show: true,
                        radius: 1,
                        formatter: labelFormatter,
                        background: {
                            opacity: 0.8
                        }
                    },
                    combine: {
                        color: "#999",
                        threshold: 0.1
                    }
                },
                legend: {
                    show: false
                }
            }
        });

        setCode([
            "$.plot('#placeholder', data, {",
            "    series: {",
            "        pie: {",
            "            show: true,",
            "            radius: 1,",
            "            tilt: 0.5,",
            "            label: {",
            "                show: true,",
            "                radius: 1,",
            "                formatter: labelFormatter,",
            "                background: {",
            "                    opacity: 0.8",
            "                }",
            "            },",
            "            combine: {",
            "                color: '#999',",
            "                threshold: 0.1",
            "            }",
            "        }",
            "    },",
            "    legend: {",
            "        show: false",
            "    }",
            "});"
        ]);
    });

    $("#example-11").click(function () {
        placeholder.unbind();

        $("#title").text("Donut Hole");
        $("#description").text("A donut hole can be added.");

        $.plot(placeholder, data, {
            series: {
                pie: {
                    innerRadius: 0.5,
                    show: true
                }
            }
        });

        setCode([
            "$.plot('#placeholder', data, {",
            "    series: {",
            "        pie: {",
            "            innerRadius: 0.5,",
            "            show: true",
            "        }",
            "    }",
            "});"
        ]);
    });

    $("#example-12").click(function () {
        placeholder.unbind();

        $("#title").text("Interactivity");
        $("#description").text("The pie can be made interactive using events.");

        $.plot(placeholder, data, {
            series: {
                pie: {
                    show: true
                }
            },
            grid: {
                hoverable: true,
                clickable: true
            }
        });

        setCode([
            "$.plot('#placeholder', data, {",
            "    series: {",
            "        pie: {",
            "            show: true",
            "        }",
            "    },",
            "    grid: {",
            "        hoverable: true,",
            "        clickable: true",
            "    }",
            "});"
        ]);
    });

    placeholder.bind("plothover", function (event, pos, obj) {
        if (!obj) {
            return;
        }
        var percent = parseFloat(obj.series.percent).toFixed(2);
        $("#hover").html("<span style='font-weight: bold; color: " + obj.series.color + "'>" + obj.series.label + " (" + percent + "%)</span>");
    });

    placeholder.bind("plotclick", function (event, pos, obj) {
        if (!obj) {
            return;
        }
        var percent = parseFloat(obj.series.percent).toFixed(2);
        alert("" + obj.series.label + ": " + percent + "%");
    });

    function labelFormatter(label, series) {
        return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
    }

    function setCode(lines) {
        $("#code").text(lines.join("\n"));
    }
});
