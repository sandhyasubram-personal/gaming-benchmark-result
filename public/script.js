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


    $('#TEST_NAME').html("Time Spy Extreme");
}

function loadOverallScore(result, systemInfo) {
    $('.procyon-overall-score h2').html('Time Spy Extreme' + ' score');
    $('.procyon-overall-score .main-score h3').html(result.scores.overallScore.uiValue);

    let gpuString = '';
    systemInfo.gpu.forEach(gpu => {
        gpuString +=
            `
            <div class="flex-col w25">
                <p class="pl0">GPU:</p>
            </div>
            <div class="flex-col w75 procyon-backgrounded mb05">
                <p>${gpu.name}</p>
            </div>
            `;
    });
    $('.gpu-summary').html(gpuString);

    let cpuString = '';
    systemInfo.cpu.forEach(cpu => {
        cpuString +=
            `
            <div class="flex-col w25">
                <p class="pl0">CPU:</p>
            </div>
            <div class="flex-col w75 procyon-backgrounded mb05">
                <p>${cpu.name}</p>
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
            <div class="w100 procyon-result-box flex-col-stretch p1">
                 <h3 class="no-border pb05">${score.baseType}</h3>
                 <h2 class="center no-border pt05">${score.uiValue}</h2>
            </div>
            `;
    });
    $('#COMPONENT_SCORE').html(componentScoreString);
}

function loadDetailedScores(componentScores) {
    let componentScoreString = '';
    componentScores.forEach(score => {
        let subScoreString = '';
        score.subScores.forEach( subScore => {
            subScoreString +=
                `
                <div class="w100">
                    <div class="flex-row w100 procyon-deepsubscore pb05">
                        <div class="w60 pr05">
                            <h4>${subScore.baseType}</h4>
                        </div>
                        <div class="w40">
                            <p>${subScore.uiValue} ${subScore.unit} </p>
                        </div>
                    </div>
                </div>
                `;
        });

        componentScoreString +=
            `
            <div class="flex-col-start w33 p05 plr1">
                <div class="flex-row procyon-subscore pb05">
                    <div class="w60 pr05">
                        <h3>${score.baseType}</h3>
                    </div>
                    <div class="w40">
                        <p>${score.uiValue}</p>
                    </div>
                </div>
                ${subScoreString}
            </div>
            `;
    });
    $('.procyon-component-score').html(componentScoreString);
}

function loadSystemInfo(systemInfo) {
    let cpuString = `<h3 class="border-bottom pb05"><i class="icon icon-cpu fm-icon mr05"></i>CPU</h3>`;
    systemInfo.cpu.forEach( cpu => {
        cpuString +=
            `
            <div each={opts.run.systemInfo.cpu} class="mb05">
                    <dl class="result-systeminfo-list-details clearfix">

                      <dt>CPU</dt>
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

    let gpuString = `<h3 class="border-bottom pb05"><i class="icon icon-gpu mr05"></i>GPU</h3>`;
    systemInfo.gpu.forEach( gpu => {
        let displayString = '';
        gpu.displays.forEach( (display, i) => {
            displayString +=
                `
                <dl class="result-systeminfo-list-details clearfix">
                        <dt>Display ${i+1}</dt>
                        <dd>${display.deviceName} (${display.resolution})</dd>
                </dl>
                `;
        });

        gpuString +=
            `
            <div class="mb05">
                    <dl class="result-systeminfo-list-details clearfix">
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

                    <div class="systeminfo-display-list">
                      ${displayString}
                    </div>
                  </div>
            `;
    });
    $('#SYSTEMINFO_GPU').html(gpuString);

    let storageString = `<h3 class="border-bottom pb05"><i class="icon icon-download fm-icon mr05"></i>Storage</h3>`;
    systemInfo.storage.forEach( (storage, i) => {
        storageString +=
            `
            <div class="systeminfo-storage-list">
                      <dl class="result-systeminfo-list-details clearfix">
                        <dt>Drive ${i+1}</dt>
                        <dd class="pr15">${storage.driveName}</dd>
                      </dl>
                      <div class="storage-info">
                        <dl class="result-systeminfo-list-details clearfix pl1">
                          <dt class="">Drive Model</dt>
                          <dd class="">${storage.driveModel}</dd>
                        </dl>
                        <dl class="result-systeminfo-list-details clearfix pl1">
                          <dt class="">Drive Type</dt>
                          <dd class="">${storage.driveType}</dd>
                        </dl>
                      </div>
                  </div>
            `;
    });
    $('#SYSTEMINFO_STORAGE').html(storageString);
}
