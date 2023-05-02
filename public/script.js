document.addEventListener("DOMContentLoaded", theDomHasLoaded, false);
window.addEventListener("load", pageFullyLoaded, false);

$.getJSON("./test.json", function (data) {
    loadResultDataIn(data);
});

function theDomHasLoaded(e) {
    // when DOM is fully loaded
}

function pageFullyLoaded(e) {
    // when page is fully loaded
}

function loadResultDataIn(result) {
    loadOverallScore(result.results[0], result.systemInfo);
    loadComponentScores(result.results[0].scores.componentScores);
    loadDetailedScores(result.results[0].scores.componentScores);
    loadSystemInfo(result.systemInfo);
/** Start D3 Speedometer */
    let pointerAngle = 86;
    let pointerLength = 135;
    let innerRadius = 110;
    let outerRadius = 130;

    let tau = 2 * Math.PI; // http://tauday.com/tau-manifesto

    let svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 1.5 + ")");

    let pie = d3.pie()
        .sort(null)
        .startAngle(-tau/3+0.2)
        .endAngle(tau/3-0.2)
        .padAngle(0);

    let segments = 50;

    let color = d3.scaleLinear().domain([0,segments-1]).range(['#dc4740','#34d8bf']).interpolate(d3.interpolateRgb);

    let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    let path = g.selectAll("path")
        .data(pie(d3.range(segments).map(function (){return 1;})))
    .enter().append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc);

    let pointer = g.append("g").attr("class","pointer");

    let line = pointer.append("line")
    .attr("x1",0).attr("y1",10)
    .attr("x2",function(){
        return -pointerLength*Math.cos(pointerAngle * tau/200);
    })
    .attr("y2",function(){
        return -pointerLength*Math.sin(pointerAngle * tau/200);
    })
    .attr("class","pointer");
/** End D3 Speedometer */

    $('.accordion').click(function(index){
        $(this).toggleClass('active');
        $(this).next().toggleClass('visible');
        $(this).find('.icon').toggleClass('rotate');
    })
}

function loadOverallScore(result, systemInfo) {
    $('.procyon-overall-score h2').html('Time Spy Extreme' + ' score');
    $('.procyon-overall-score h3').html(result.scores.overallScore.uiValue);

    let gpuString = '';
    systemInfo.gpu.forEach(gpu => {
        gpuString +=
            `
            <div class="details-content">
                <p> <span class="icon gpu"></span> ${gpu.name}</p>
            </div>
            `;
    });
    $('.gpu-summary').html(gpuString);

    let cpuString = '';
    systemInfo.cpu.forEach(cpu => {
        cpuString +=
            `
            <div class="details-content">
                <p> <span class="icon cpu"></span> ${cpu.name}</p>
            </div>
            `;
    });
    $('.cpu-summary').html(cpuString);
}

function loadComponentScores(componentScores) {
    let componentScoreString = '';
    componentScores.forEach(score => {
        componentScoreString +=
            `
            <div class="result-box w50">
                 <h3 class="no-border">${score.baseType}</h3>
                 <h2 class="center no-border">${score.uiValue}</h2>
            </div>
            `;
    });
    $('#COMPONENT_SCORE').html(componentScoreString);
}

function loadDetailedScores(componentScores) {
    let componentScoreString = '';
    let componentRef = {
        'TIME_SPY_GRAPHICS_SCORE_X' : {
            icon : 'gpu'
        },
        'TIME_SPY_CPU_SCORE_X' : {
            icon : 'cpu'
        },
        'GT_1' : 'Test 1',
        'GT_2' : 'Test 2',
        'CPU_TEST_TIME' : 'Avg Simulation Time per Frame'
    };
    componentScores.forEach(score => {
        let subScoreString = '';
        score.subScores.forEach( subScore => {
            subScoreString +=
                `
                <div class="tile-details">
                    <div class="tile-heading">
                        <h4>${componentRef[subScore.baseType]}</h4>
                    </div>
                    <div class="tile-value number">
                        <p>${subScore.uiValue}<span class="unit">${subScore.unit}</span></p>
                    </div>
                </div>
                `;
        });

        componentScoreString +=
            `
            <div class="flex-gap">
                <div class="result-box">
                    <div class="tile">
                        <div class="tile-icon">
                            <span class="icon color big `   + componentRef[score.type].icon +   ` cpu"></span>
                        </div>
                        <div class="tile-details">
                            <div class="tile-heading">
                                <h3>${score.baseType}</h3>
                            </div>
                            <div class="tile-number number">
                                ${score.uiValue}
                            </div>
                        </div>
                    </div>            
                    <div class="tile spread">
                        ${subScoreString}
                    </div>
                </div>
            </div>
            `;
    });
    $('.procyon-component-score').html(componentScoreString);
}

function loadSystemInfo(systemInfo) {
    let cpuString = ``;
    systemInfo.cpu.forEach( cpu => {
        cpuString +=
            `
            <div each={opts.run.systemInfo.cpu}>
                    <dl class="panel-list">

                      <dt>Name</dt>
                      <dd>${cpu.name}</dd>

                      <dt>Codename</dt>
                      <dd>${cpu.processorCodeName}</dd>

                      <dt>Clock frequency</dt>
                      <dd>${cpu.stockFrequencyMhz}MHz</dd>

                      <dt>Max Frequency</dt>
                      <dd>${cpu.maxFrequencyMhz} MHz</dd>

                      <dt>Cores</dt>
                      <dd>${cpu.coreCount} (${cpu.threadCount})</dd>

                      <dt>Package</dt>
                      <dd>${cpu.processorPackage}</dd>

                      <dt>Manufacturing process</dt>
                      <dd>${cpu.manufacturingProcessNm} NM</span></dd>

                      <dt>Core VID</dt>
                      <dd>${cpu.voltageId} V</dd>

                      <dt>Virtual Technology</dt>
                      <dd>${cpu.virtualTechnologyCapable}</dd>
                    </dl>
                  </div>
            `
    });
    $('#SYSTEMINFO_CPU').html(cpuString);

    let gpuString = ``;
    systemInfo.gpu.forEach( gpu => {
        let displayString = '';
        gpu.displays.forEach( (display, i) => {
            displayString +=
                `
                <dl>
                    <dt>Display ${i+1}</dt>
                    <dd>${display.deviceName} (${display.resolution})</dd>
                </dl>
                `;
        });

        gpuString +=
            `
            <div>
                <dl class="panel-list">
                    <dt>GPU</dt>
                    <dd>${gpu.name}</dd>

                    <dt>Memory</dt>
                    <dd>${gpu.memory.memoryAmountMb} MB ${gpu.memory.memoryType}</dd>

                    <dt>Available VRAM</dt>
                    <dd>${gpu.memory.availableVram} MB</dd>

                    <dt>Code Name</dt>
                    <dd>${gpu.codeName}</dd>

                    <dt>Manufacturer</dt>
                    <dd>${gpu.pciDeviceId.vendorName} / ${gpu.pciDeviceId.subvendorName}</dd>

                    <dt>Manufacturing process</dt>
                    <dd>${gpu.manufacturingProcess} NM</dd>
                    <dt>Driver Version</dt>
                    <dd>${gpu.driverInfo.driverVersion}</dd>

                    <dt>Clock frequency</dt>
                    <dd>${gpu.clockSpeed.gpu.currentMhz} MHz</dd>

                    <dt>Boost</dt>
                    <dd>${gpu.clockSpeed.boost.currentMhz} MHz
                    </dd>

                    <dt>Memory clock frequency</dt>
                    <dd>${gpu.clockSpeed.memory.currentMhz} MHz</dd>
                </dl>

                ${displayString}
            </div>
            `;
    });
    $('#SYSTEMINFO_GPU').html(gpuString);

    let storageString = ``;
    systemInfo.storage.forEach( (storage, i) => {
        storageString +=
            `
            <div>
                <dl class="panel-list">
                    <dt>Drive ${i+1}</dt>
                    <dd>${storage.driveName}</dd>
                </dl>
                <div class="storage-info">
                    <dl>
                        <dt>Drive Model</dt>
                        <dd>${storage.driveModel}</dd>
                    </dl>
                    <dl>
                        <dt>Drive Type</dt>
                        <dd>${storage.driveType}</dd>
                    </dl>
                </div>
            </div>
            `;
    });
    $('#SYSTEMINFO_STORAGE').html(storageString);
}
