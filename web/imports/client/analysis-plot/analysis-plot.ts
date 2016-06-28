import 'reflect-metadata';
import './analysis-plot.css';
import {Component, OnChanges, Input, ElementRef} from 'angular2/core';
import {Constants} from '../../constants';

declare var Plotly: any;
declare var _u: any;
declare var math: any;

@Component({
    selector: 'analysis-plot',
    templateUrl: Constants.BASE + '/imports/client/analysis-plot/analysis-plot.html',
    styleUrls: [Constants.BASE + '/imports/client/analysis-plot/analysis-plot.css'],
})

export class AnalysisPlot implements OnChanges{
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
        saveAs(blob, "plot_" + this.experiment._id + "_" + this.analysis.spec.name + ".json");
    }

    doPlot(){
        let configs = this.experiment.configurations;
        let x_data_key = this.analysis.spec.x_data;
        let y_data_key = this.analysis.spec.y_data;
        let datas = configs.map(config => {
            return {
                x: _u.result(config, x_data_key, []), 
                y: _u.result(config, y_data_key, []),
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
            if (step.action == 'best'){
                let grouped = _u.groupBy(_u.zip(params, datas), p_d => JSON.stringify(_u.sortBy(_u.toPairs(_u.omit(p_d[0], step.parameters)), p => p[0])));

                let score_method = step.score;
                if (score_method == 'max_final' || score_method == 'min_final'){
                    grouped = _u.values(grouped).map(g => _u.sortBy(g, p_d => p_d[1].y[p_d[1].y.length-1]));
                    if (score_method == 'max_final'){
                        grouped = grouped.map(g => g[g.length-1]);
                    }
                    else if (score_method == 'min_final'){
                        grouped = grouped.map(g => g[0]);
                    }
                } else if (score_method == 'max_auc' || score_method == 'min_auc'){
                    grouped = _u.values(grouped).map(g => _u.sortBy(g, p_d => math.mean(p_d[1].y)));
                    if (score_method == 'max_auc'){
                        grouped = grouped.map(g => g[g.length-1]);
                    }
                    else if (score_method == 'min_auc'){
                        grouped = grouped.map(g => g[0]);
                    }
                }
                [params, datas] = _u.unzip(grouped);
            }
            if (step.action == 'average'){
                let with_std = !!step.with_std;
                let grouped = _u.groupBy(_u.zip(params, datas), p_d => JSON.stringify(_u.sortBy(_u.toPairs(_u.omit(p_d[0], step.parameters)), p => p[0])));
                let added = _u.values(grouped).map(g => _u.unzip(g)).map(g => [
                    g[0][0],
                    _u.mapValues(_u.groupBy(_u.flatten(g[1].map(_u.toPairs)), p => p[0]), v => v.map(vv => vv[1]))
                ]).map(g => {
                    let obj = {
                        x: math.mean(g[1].x, 0),
                        y: math.mean(g[1].y, 0),
                    };
                    if (with_std){
                        obj.y_std = math.sqrt(math.mean(math.dotPow(g[1].y.map(g1y_e => math.subtract(g1y_e, obj.y)),2), 0));
                    }
                    return [g[0], obj ];
                });
                [params, datas] = _u.unzip(added);
                params = params.map(param => _u.omit(param, step.parameters));
            }
            if (step.action == 'moving_average'){
                let window_size = step.window_size;
                datas = datas.map(data => {
                    new_y = data.y.map((val, ind, y) => {
                        let hws = math.round(window_size/2)-1;
                        let ind_min = math.max(0, ind-hws);
                        let ind_max = math.min(ind+hws+1, y.length);

                        return math.mean(math.subset(y, math.index(math.range(ind_min, ind_max))));
                    });
                    data.y = new_y;
                    return data;
                });
            }
            if (step.action == 'merge'){
                let grouped = _u.groupBy(_u.zip(params, datas), p_d => JSON.stringify(_u.sortBy(_u.toPairs(_u.omit(p_d[0], step.parameters)), p => p[0])));
                let added = _u.values(grouped).map(g => _u.unzip(g)).map(g => [
                    g[0][0],
                    _u.mapValues(_u.groupBy(_u.flatten(g[1].map(_u.toPairs)), p => p[0]), v => v.map(vv => vv[1]))
                ]).map(g => {
                    let obj = _u.sortBy(_u.zip(g[1].x, g[1].y), (a) => a[0]);
                    let [ox, oy] = _u.unzip(obj);
                    return [g[0], {x: ox, y: oy} ];
                });
                [params, datas] = _u.unzip(added);
                params = params.map(param => _u.omit(param, step.parameters));
            }
            if (step.action == 'filter'){
                let step_params = _u.map(step.parameters, p => _u.toPairs(p)[0]);
                [params, datas] = _u.unzip(_u.filter(_u.zip(params, datas), p_d => _.some(step_params, p => p_d[0][p[0]] == p[1])));
            }
            if (step.action == 'log_transform'){
                let axis = step.axis;
                datas = datas.map(data => {
                    let new_data = math.log(math.add(1.0, data[axis]));
                    data[axis] = new_data;
                    return data;
                });
            }
            if (step.action == 'subtract_min'){
                let epsilon = 1e-10;
                let mins = datas.map(data => math.min(data.y));
                let global_min = math.min(mins);
                datas = datas.map(data => {
                    let new_data = math.subtract(data.y, math.add(global_min, epsilon));
                    data.y = new_data;
                    return data;
                });
            }
        });

        let plots = _u.zipWith(datas, params, (data, param) => {
            let d = {
                name: _u.toPairs(param).map(p => p[0] + ':' + p[1]).reduce((s, p) => (s.length > 0?(s + ', ' + p):p), ''),
                x: data.x,
                y: data.y,
                type: 'scatter',
            };
            if ('y_std' in data){
                d.error_y = {
                    type: 'data',
                    visible: true,
                    array: data.y_std,
                };
            }
            return d;
        });

        let layout_default = {
            plot_bgcolor: "#ddd",
            font: {
                family: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif",
                size: 14,
            },
            xaxis: {
                autorange: true,
                showline: true,
                showgrid: false,
                ticks: "outside",
            },
            yaxis: {
                type: 'log',
                autorange: true,
            },
            //autosize: true,
            //width: 1600,
            //height: 800,
            margin: {
                t: 20,
                r: 420,
                b: 50,
                l: 50
            },
        };

        let layout = {};
        if('layout' in this.analysis.spec){
            layout = this.analysis.spec.layout;
        }

        layout = _u.defaultsDeep(layout, layout_default);

        _u.each(plots, (p, i) => {
            p['mode'] = 'lines+markers';
            p['marker'] = { 
                size: 10,
                symbol: i,
            };
        });

        let plot_elem = this.element.nativeElement.querySelector("#analysis-plot");
        this.plots = plots;
        Plotly.plot(plot_elem, plots, layout);
    }

}
