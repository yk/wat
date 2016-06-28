import 'reflect-metadata';
import './analysis-scatter.css';
import {Component, OnChanges, Input, ElementRef} from 'angular2/core';
import {Constants} from '../../constants';

declare var Plotly: any;
declare var _u: any;
declare var math: any;

@Component({
    selector: 'analysis-scatter',
    templateUrl: Constants.BASE + '/imports/client/analysis-scatter/analysis-scatter.html',
    styleUrls: [Constants.BASE + '/imports/client/analysis-scatter/analysis-scatter.css'],
})

export class AnalysisScatter implements OnChanges{
    @Input() experiment: Experiment;
    @Input() analysis: Analysis;

    constructor(el: ElementRef){
        this.element = el;
    }

    ngOnChanges(){
        if (this.analysis && this.experiment) {
            this.doPlot();
        }
    }

    savePlot(){
        let json = JSON.stringify(this.plots);
        let blob = new Blob([json], {type: "application/json"});
        saveAs(blob, "scatter_" + this.experiment._id + "_" + this.analysis.spec.name + ".json");
    }

    doPlot(){
        let configs = this.experiment.configurations;
        let x_data_key = this.analysis.spec.x_data;
        let y_data_key = this.analysis.spec.y_data;
        let datas = configs.map(config => {
            return {
                x: _u.result(config, x_data_key), 
                y: _u.result(config, y_data_key),
            }
        });
        let params = configs.map(config => config.local_config);
        this.analysis.spec.steps.forEach(step => {
            if (step.action == 'compare'){
                params = params.map(param => _u.pick(param, step.parameters));
            }
            if (step.action == 'drop'){
                params = params.map(param => _u.omit(param, step.parameters));
            }
        });

        let datas_x = _u.map(datas, 'x');
        let datas_y = _u.map(datas, 'y');
        let descriptions = _u.map(params, (param) => _u.toPairs(param).map(p => p[0] + ':' + p[1]).reduce((s, p) => (s.length > 0?(s + ', ' + p):p), ''));

        let plots = [{
            x: datas_x,
            y: datas_y,
            type: 'scatter',
            text: descriptions,
        }];

        let layout_default = {
            plot_bgcolor: "#ddd",
            xaxis: {
                autorange: true,
                showline: true,
                showgrid: false,
                ticks: "outside",
            },
            yaxis: {
                autorange: true,
            },
            margin: {
                t: 20,
                r: 420,
                b: 40,
                l: 20
            },
        };

        let layout = {};
        if('layout' in this.analysis.spec){
            layout = this.analysis.spec.layout;
        }

        layout = _u.defaultsDeep(layout, layout_default);

        _u.each(plots, (p, i) => {
            p['mode'] = 'markers';
            p['marker'] = { 
                size: 10,
                symbol: i,
            };
        });

        let plot_elem = this.element.nativeElement.querySelector("#analysis-scatter");
        this.plots = plots;
        Plotly.plot(plot_elem, plots, layout);
    }

}
