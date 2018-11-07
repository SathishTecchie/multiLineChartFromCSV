import { Component, AfterViewInit } from '@angular/core';
declare var CanvasJS: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public serverData: string[];
  ngAfterViewInit() {
  }
  /**
   * @name fileChangeListener
   * @param $event
   * @returns none
   * @desc It is used to read data from the file 
   */
  fileChangeListener($event): void {
    const input = $event.target;
    if (input.files.length > 0) {
      document.getElementById('chartContainer').style.display = 'block';
      const reader: any = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        const formattedChartData = this.manipulateChartData(reader.result.split(/\r\n|\n/));
        this.renderChart(JSON.stringify(formattedChartData));
      }
    } else[
      document.getElementById('chartContainer').style.display = 'none'
    ]
  };
  /**
   * @name renderChart
   * @param formattedChartData 
   * @returns none
   * @desc It is used to render the data on the chart
   */
  renderChart(formattedChartData) {
    formattedChartData = JSON.parse(formattedChartData);
    formattedChartData.map(element => {
      for (let key in element) {
        element['dataPoints'] = element[key];
        element['legendText'] = key;
      }
      element['type'] = 'line';
      element['showInLegend'] = true;
    });
    const chart = new CanvasJS.Chart("chartContainer",
      {
        data: formattedChartData
      });
    chart.render();
  }
  /**
   * @name manipulateChartData
   * @param chartData 
   * @return Array<object>
   * @desc It is used to convert the file data to JSON format.
   */
  manipulateChartData(chartData) {
    this.serverData = [];
    chartData.forEach(element => {
      let jsonObj: any = {};
      let seriesName = '';
      element.split(',').forEach((ele, index) => {
        let localObj = {}
        if (index === 0 && ele) {
          jsonObj[ele] = [];
          seriesName = ele;
        } else if (ele) {
          localObj['x'] = parseInt(ele.split('|')[0]);
          localObj['y'] = parseInt(ele.split('|')[1]);
        }
        if (Object.keys(localObj).length > 0) {
          jsonObj[seriesName].push(localObj)
        }
      });
      Object.keys(jsonObj).length > 0 ? this.serverData.push(jsonObj) : '';
    });
    return this.serverData;
  }
}
