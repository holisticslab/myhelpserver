import React from 'react';
import {
    Input,
    Button,
    Container,
    Header,
    Icon,
    Segment, Form, Grid, Image, Menu, List, Card, Checkbox
} from 'semantic-ui-react'

import { MeetingContext } from './function'
import 'chart.js/auto';
import { useParams, useHistory } from "react-router-dom";
import { Doughnut, Bar } from 'react-chartjs-2';

const Ncr = () => {

    const { session, ncr } = useParams();
    const history = useHistory();

    const { data } = React.useContext(MeetingContext);
    const [mobile, setMobile] = React.useState(false);
    const [pass, setPass] = React.useState(true);
    const [chartdata, setChartData] = React.useState(null)
    const [info, setInfo] = React.useState(null);
    const [hasMark, setMark] = React.useState(false);
    const [cklist, setCklist] = React.useState(null);
    const [stockData, setStockData] = React.useState(null);
    const [newResult, setNewResult] = React.useState(null);
    const [ncChange, setNcChange] = React.useState(null);
    const [disable, setDisable] = React.useState(null);
    const [barChart, setBarChart] = React.useState(null);




    let ConstColors = [
        "#33ff33",
        "#ffff4d", // yellow green
        "#ffb84d", // yellow
        "#ac7339", // orange
        "#ff1a1a", // red
        "#e2bcbd" // purple
    ];

    const options = {
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };


    React.useEffect(() => {

        const bootstrapAsync = async () => {
            // let newdata=JSON.parse(rawdata);
            // console.log(newdata);
            // setData(newdata);
        };

        bootstrapAsync();
        if (data) {
            startAnalyze(data, data.auditResult, data.newNC, data.auditDisable);
            setInfo(data.info);
            setNewResult(data.auditResult);
            setNcChange(data.newNC);
            setDisable(data.auditDisable);
            setStockData(data);
            sessionStorage.setItem(session, JSON.stringify(data));
            filterData(data.checkList, ncr);

        }
        else {
            const newdata = JSON.parse(sessionStorage.getItem(session)) || false
            console.log("newdata")
            console.log(newdata);
            if (newdata) {
                setInfo(newdata.info);
                setNewResult(newdata.auditResult);
                setNcChange(newdata.newNC);
                setDisable(newdata.auditDisable);
                setStockData(newdata);
                startAnalyze(newdata, newdata.auditResult, newdata.newNC, newdata.auditDisable);
                filterData(newdata.checkList, ncr);
            }

        }

    }, []);

    const filterData = (x, nc) => {
        let newfilter = []
        x.forEach((k) => {
            const items = k.items.filter(({ severity }) => severity == nc);
            if (items.length > 0) {
                newfilter.push({ ...k, items });
            }
            return k.length > 0;
        })
        setCklist(newfilter);
        // createpanes(filterData);
    }
    const RenderCheckList = ({ data }) => {
        return (
            <List className="cklistSection" style={{ textAlign: 'left' }} divided verticalAlign='middle' relaxed size="large">
                {data.map(({ section, items }, sid) => <React.Fragment>
                    <List.Item key={sid}>
                        <List.Header>{section}</List.Header>
                    </List.Item>
                    {items.map((item, index) => {
                        //console.log(item);
                        let nc = ncr;
                        switch (item.type) {
                            case "CHECKLIST":
                                return <List.Item key={sid + "_" + index} className="cklistItem" style={{
                                    borderLeft: ` 2vw solid ${ConstColors[nc - 1][0]}`, backgroundColor: item.autoFailed === "1" ? "#FA8072" : "transparent",
                                }}>

                                    <List.Content floated='right' verticalAlign="middle">
                                        <Checkbox checked={newResult[item.id]} id={`checkbox-${item.id}`} onChange={(e, data) => {
                                            let n = JSON.parse(JSON.stringify(newResult));
                                            n[item.id] = data.checked;
                                            startAnalyze(stockData, n, ncChange, disable)
                                            setNewResult(n);
                                        }} disabled={disable[item.id]} />
                                    </List.Content>
                                    <List.Icon >
                                        <Button circular icon='ellipsis vertical' onClick={() => { }} />
                                    </List.Icon>
                                    <List.Content verticalAlign="middle" className="">
                                        <label for={`checkbox-${item.id}`}>{item.text_ms}</label>
                                        {/* {this.comment[item.id] &&
                                <p className="commentTxt" onClick={() => {this.makeComment(item.id) }}>{this.comment[item.id]} </p>}
                            {this.figure[item.id] &&
                                <div id={`fgr_${item.id}`} className="fgrFrame">
                                    {this.figure[item.id].map(
                                        (foto, index) => {
                                            return (
                                                <a key={index} className="thumbnail" onClick={() => { this.anotatePhoto(foto.src,item.id,index); }}>
                                                    <img className={foto.post} src={foto.src+'?t=' + new Date().getTime()} />
                                                </a>
                                            );
                                        })}

                                </div>
                            } */}
                                    </List.Content>



                                </List.Item>;
                            case "MARKED":
                                return <List.Item key={sid + "_" + index} className="cklistItem" style={{
                                    borderLeft: ` 2vw solid ${ConstColors[nc - 1][0]}`, backgroundColor: item.autoFailed === "1" ? "#FA8072" : "transparent",
                                }}>

                                    <List.Content floated='right' verticalAlign="middle">
                                        <Checkbox checked={newResult[item.id]} id={`checkbox-${item.id}`} onChange={(e, data) => {
                                            let n = JSON.parse(JSON.stringify(newResult));
                                            n[item.id] = data.checked;
                                            startAnalyze(stockData, n, ncChange, disable)
                                            setNewResult(n);
                                        }} disabled={disable[item.id]} />
                                    </List.Content>
                                    <List.Icon >
                                        <Button circular icon='ellipsis vertical' onClick={() => { }} />
                                    </List.Icon>
                                    <List.Content verticalAlign="middle" className="">
                                        <label for={`checkbox-${item.id}`}>{item.text_ms}</label>

                                    </List.Content>



                                </List.Item>;
                            case 'TITLE':
                                return <List.Item key={sid + "_" + index} className="cklistItem" >
                                    <List.Header>{item.text_ms}</List.Header>
                                </List.Item>;
                            case 'LABEL':
                                return <List.Item key={sid + "_" + index} className="cklistItem" >
                                    <List.Header>{item.text_ms}</List.Header>
                                </List.Item>;
                            case 'NUMBER':
                                return <List.Item key={sid + "_" + index} className="cklistItem" >
                                    <List.Content verticalAlign="middle">
                                        <label for={`checkbox-${item.id}`}>{item.text_ms}</label>
                                        <Input fluid type="number" value={""} placeholder='' onChange={(event) => { }} />
                                    </List.Content>
                                </List.Item>;
                            case 'TEXT':
                                return <List.Item key={sid + "_" + index} className="cklistItem" >
                                    <List.Content verticalAlign="middle">
                                        <label for={`checkbox-${item.id}`}>{item.text_ms}</label>
                                        <Input fluid type="text" value={""} placeholder='' onChange={(event) => { }} />
                                    </List.Content>
                                </List.Item>;
                            default:
                                return null;
                        }
                    }
                    )}
                </React.Fragment>
                )}
            </List>
        )
    }

    const startAnalyze = async ({ info, severities, auditNotes, checkList, summaryNote, passRules, reportChart, reportSetting }, auditResult, newNC, auditDisable) => {

        try {

            setMark(severities[0].mark > -1);
            let newserv = JSON.parse(JSON.stringify(severities));
            let pass = 0;
            let countpass = 0;
            let total = 0;
            let oritotal = 0;
            let isPass = true;
            let custChart = JSON.parse(JSON.stringify(reportChart));
            const hideRef = (reportSetting && reportSetting.hideref == true) ? true : false;

            let sectdata = new Array(checkList.length); for (let i = 0; i < checkList.length; ++i) sectdata[i] = 0;

            let barDataSet = [
                {
                    label: 'Pass',
                    data: JSON.parse(JSON.stringify(sectdata)),
                    backgroundColor: ConstColors[0],
                }
            ]
            newserv.forEach(({ name, color }, i) => {
                barDataSet.push(
                    {
                        label: name,
                        data: JSON.parse(JSON.stringify(sectdata)),
                        backgroundColor: color == "" ? ConstColors[i + 1] : color,
                    }
                )
            });

            let barLabel = [];

            for (const [index, { section, items }] of checkList.entries()) {
                barLabel.push(section);
                // reportChart.
                let customPass = 0;
                let customTotal = 0;
                let customCount = 0;
                let customSeverities;
                let cdx = reportChart.findIndex(({ grp }) => grp.findIndex((name) => name == section) > -1);

                if (cdx >= 0) {
                    if (custChart[cdx].severities) {
                        customSeverities = custChart[cdx].severities;
                        customPass = custChart[cdx].pass;
                        customCount = custChart[cdx].count;
                        customTotal = custChart[cdx].total;
                    }
                    else {
                        customSeverities = JSON.parse(JSON.stringify(severities));

                    }
                }



                let deduct = -1;
                for (const [i, { id, autoFailed, severity, type, text_ms, info, autofailed, custom_mark }] of items.entries()) {

                    oritotal++;
                    let svrvalue = 1;
                    let resultcol;

                    if (!auditDisable[id]) {

                        if (type === "CHECKLIST") {


                            let activeNC = newNC[id] || severity;
                            let idx = severities.findIndex(({ id }) => id == activeNC);

                            if (idx < 0) throw "error";

                            if (severities[idx].mark) {
                                svrvalue = parseFloat(severities[idx].mark);
                            }
                            total = total += svrvalue;
                            customTotal += svrvalue;

                            if (auditResult[id]) {
                                // resultcol = t('complied');
                                if (severities[idx].mark) {
                                    pass = pass + parseFloat(severities[idx].mark);
                                    customPass += parseFloat(severities[idx].mark);
                                    customCount++;
                                    countpass++;
                                }
                                else {
                                    pass++;
                                    customPass++;
                                }

                                barDataSet[0].data[index]++;

                            }
                            else {
                                barDataSet[idx + 1].data[index]++;

                                if (severities[idx].mark) {
                                    if (newserv[idx].value) {
                                        newserv[idx].value = newserv[idx].value + parseFloat(severities[idx].mark);
                                        newserv[idx].count++;
                                    }
                                    else {
                                        newserv[idx].value = parseFloat(severities[idx].mark);
                                        newserv[idx].count = 1;
                                    }

                                    if (cdx >= 0) {
                                        if (customSeverities[idx].value) {
                                            customSeverities[idx].value += parseFloat(severities[idx].mark);
                                            customSeverities[idx].count++;
                                        }
                                        else {
                                            customSeverities[idx].value = parseFloat(severities[idx].mark);
                                            customSeverities[idx].count = 1;
                                        }
                                    }

                                    //   resultcol = [severities[idx].name, `-${severities[idx].mark}`];
                                }
                                else {
                                    if (newserv[idx].value) {
                                        newserv[idx].value++
                                        newserv[idx].count++
                                    }
                                    else {
                                        newserv[idx].value = 1;
                                        newserv[idx].count = 1;
                                    }

                                    //   resultcol = severities[idx].name;

                                    if (cdx >= 0) {
                                        if (customSeverities[idx].value) {
                                            customSeverities[idx].value++
                                            customSeverities[idx].count++
                                        }
                                        else {
                                            customSeverities[idx].value = 1;
                                            customSeverities[idx].count = 1;
                                        }
                                    }
                                }
                                if (autofailed) { isPass = false }
                            }
                        }
                        else if (type === "MARKED") {


                            let activeNC = newNC[id] || severity;
                            let idx = severities.findIndex(({ id }) => id == activeNC);

                            if (idx < 0) throw "error";

                            if (severities[idx].mark) {
                                svrvalue = parseFloat(severities[idx].mark);
                            }

                            total = total += parseFloat(custom_mark);
                            customTotal += parseFloat(custom_mark);

                            if (auditResult[id] > 0) {
                                // resultcol = t('complied');
                                pass = pass + parseFloat(auditResult[id]);
                                customPass += parseFloat(auditResult[id]);
                                customCount++;
                                countpass++;


                                const markdiff = custom_mark - parseFloat(auditResult[id])
                                if (markdiff > 0) {
                                    if (newserv[idx].value) {
                                        newserv[idx].value += markdiff;
                                        newserv[idx].count++;
                                    }
                                    else {
                                        newserv[idx].value = markdiff;
                                        newserv[idx].count = 1;
                                    }

                                    if (cdx >= 0) {
                                        if (customSeverities[idx].value) {
                                            customSeverities[idx].value += markdiff;
                                            customSeverities[idx].count++;
                                        }
                                        else {
                                            customSeverities[idx].value = markdiff;
                                            customSeverities[idx].count = 1;
                                        }
                                    }

                                }

                                barDataSet[0].data[index]++;

                            }
                            else {
                                barDataSet[idx + 1].data[index]++;

                                if (severities[idx].mark) {
                                    if (newserv[idx].value) {
                                        newserv[idx].value = newserv[idx].value + parseFloat(severities[idx].mark);
                                        newserv[idx].count++;
                                    }
                                    else {
                                        newserv[idx].value = parseFloat(severities[idx].mark);
                                        newserv[idx].count = 1;
                                    }

                                    if (cdx >= 0) {
                                        if (customSeverities[idx].value) {
                                            customSeverities[idx].value += parseFloat(severities[idx].mark);
                                            customSeverities[idx].count++;
                                        }
                                        else {
                                            customSeverities[idx].value = parseFloat(severities[idx].mark);
                                            customSeverities[idx].count = 1;
                                        }
                                    }

                                    //   resultcol = [severities[idx].name, `-${severities[idx].mark}`];
                                }
                                else {
                                    if (newserv[idx].value) {
                                        newserv[idx].value++
                                        newserv[idx].count++
                                    }
                                    else {
                                        newserv[idx].value = 1;
                                        newserv[idx].count = 1;
                                    }

                                    //   resultcol = severities[idx].name;

                                    if (cdx >= 0) {
                                        if (customSeverities[idx].value) {
                                            customSeverities[idx].value++
                                            customSeverities[idx].count++
                                        }
                                        else {
                                            customSeverities[idx].value = 1;
                                            customSeverities[idx].count = 1;
                                        }
                                    }
                                }
                                if (autofailed) { isPass = false }
                            }
                        }
                        if (type === "LABEL" || type === "TITLE") {
                            deduct = i;
                        }


                    }

                }


                if (cdx >= 0) {
                    custChart[cdx].severities = customSeverities;
                    custChart[cdx].pass = customPass;
                    custChart[cdx].countpass = customCount;
                    custChart[cdx].total = customTotal;
                }

            }
            // checkList.forEach(({section,items}, i) => {});


            let piechartData = {
                id: [null],
                value: [(pass / total) * 360], label: [pass], legend: ["Pass"], colors: [ConstColors[0]], percent: [((pass / total) * 100).toFixed(2)], count: [countpass]
            }


            passRules.forEach(({ variable, value, condition }, i) => {

                if (variable === "MARK") {
                    let resmark = ((pass / total) * 100).toFixed(2);
                    let res = operators[condition](resmark, value)
                    if (!res) isPass = res;
                }
                else {
                    let nidx = severities.findIndex(({ id }) => id == variable);
                    let smark = (newserv[nidx].value / severities[nidx].mark) || 0;

                    let res = operators[condition](smark, value);
                    if (!res) isPass = res;
                }
            })

            newserv.forEach(({ value, name, color, count, id }, i) => {
                // if (count && value) {
                piechartData.value.push(((value / total) * 360) || 0);
                piechartData.label.push(value || 0);
                piechartData.legend.push(name);
                piechartData.id.push(id);
                piechartData.colors.push(color == "" ? ConstColors[i + 1] : color);
                piechartData.percent.push((((value / total) * 100) || 0).toFixed(2))
                piechartData.count.push(count || 0);
                // }
            });

            let custchartlist = [];
            if (custChart.length) {
                custChart.forEach(({ severities, pass, total, countpass }) => {
                    let custchartData = {
                        value: [(pass / total) * 360], label: [pass], legend: ["pass"], colors: [ConstColors[0]], percent: [((pass / total) * 100).toFixed(2)], count: [countpass]
                    }

                    severities.forEach(({ value, name, color, count }, i) => {
                        if (count && value) {
                            custchartData.value.push((value / total) * 360);
                            custchartData.label.push(value || 0);
                            custchartData.legend.push(name);
                            custchartData.colors.push(color == "" ? ConstColors[i + 1] : color);
                            custchartData.percent.push((((value / total) * 100) || 0).toFixed(2))
                            custchartData.count.push(count || 0);
                        }
                    });
                    custchartlist.push(custchartData);
                });

                // console.log(custChart);
            }

            //   setReportData(dd);
            setChartData(piechartData);
            setBarChart({ labels: barLabel, datasets: barDataSet });
            // generateChart(piechartData);
            setPass(isPass)
            //   wv.current.injectJavaScript(run);

            //   setCustomChartData(custchartlist);
            //   getCustomPie(custchartlist)

        } catch (error) {
            console.log(error)
            //   Alert.alert(t("attention"), error)
            //   setLoading(false);
        }
    }


    const RenderChart = x => <React.Fragment>
        <Grid.Column style={{ height: "100%" }} mobile={16} tablet={6} computer={5}>
            <Card fluid style={{ height: "100%" }}>
                <Card.Content style={{ textAlign: "center" }} header='Summary' />
                <Card.Content style={{ height: "100%" }}>
                    {/* <canvas ref={canvasEl} style={{ width: csswidth, height: cssheight }} /> */}
                    {chartdata && <Doughnut options={{
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }} data={{
                        labels: chartdata.legend,
                        datasets: [{
                            label: info.title,
                            data: chartdata.count,
                            backgroundColor: chartdata.colors,
                            borderWidth: 1
                        }]
                    }} />}
                </Card.Content>
                {/* <Card.Content extra>
                        <Icon name='user' />4 Friends
                    </Card.Content> */}
            </Card>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={10} computer={11} >
            <Card fluid>
                <Card.Content style={{ textAlign: "center" }} header='Details' />
                <Card.Content>
                    {barChart && <Bar options={options} data={barChart} />}
                </Card.Content>
            </Card>
        </Grid.Column>
    </React.Fragment>

    return <Container>
        <Menu fixed='top' color={"red"} inverted widths={3}>
            <Menu.Item header name={info ? info.title : 'home'} />
        </Menu>
        <Grid stackable columns={2} style={{ marginTop: "5px" }} verticalAlign='middle' centered>

            {(chartdata && info) && <Grid.Row columns='5' >
                {
                    chartdata.id.map((x, i) => <Grid.Column >
                        <Card color={x == ncr && 'grey'} key={i} as={i > 0 && "a"} onClick={() => {
                            if (i > 0) {
                                history.replace(`./${x}`);
                                filterData(stockData.checkList, x);
                            } else {
                                history.goBack();
                            }
                        }} fluid style={{ backgroundColor: chartdata.colors[i], textAlign: 'center' }} >
                            <Card.Content>

                                <Card.Header >{chartdata.legend[i]}</Card.Header>
                            </Card.Content>
                            <Card.Content>
                                <Card.Header style={{ fontSize: "36pt" }}>{chartdata.count[i]}</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                {hasMark ?
                                    <Card.Header>{`${chartdata.value[i].toFixed(2)} (${chartdata.percent[i]}%)`}</Card.Header>
                                    :
                                    <Card.Header>{`${chartdata.percent[i]}%`}</Card.Header>
                                }
                            </Card.Content>
                        </Card></Grid.Column>)}
            </Grid.Row>
            }
            <Grid.Row >
                {cklist && cklist.lenght > 0 ? <RenderCheckList data={cklist} />
                    :
                    <RenderChart />
                }
            </Grid.Row>
        </Grid></Container>
}

export default Ncr;


const operators = {
    '>': (a, b) => parseFloat(a) > parseFloat(b),
    '<': (a, b) => parseFloat(a) < parseFloat(b),
    // ...
};