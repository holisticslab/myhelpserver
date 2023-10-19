import React from 'react';
import {
    Input,
    Button,
    Container,
    Header,
    Icon,
    Segment, Form, Grid, Image, Menu, List, Card,Tab,Checkbox
} from 'semantic-ui-react'

import { MeetingContext } from './function'
import 'chart.js/auto';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useParams } from "react-router-dom";

const Ncr_details = () => {

    const { session,ncr } = useParams();
    const { data } = React.useContext(MeetingContext);
    const [mobile, setMobile] = React.useState(false);
    const [pass, setPass] = React.useState(true);
    const [cssheight, setCssHeight] = React.useState("100%");
    const [csswidth, setCssWidth] = React.useState("100%");
    const [chartdata, setChartData] = React.useState(null)
    const [hasMark, setMark] = React.useState(false);
    const [cklist, setCklist] = React.useState(null);
    const [panes,setpanes] = React.useState([]);
    const [header,setheader] = React.useState(null);




    const canvasEl = React.useRef(null);
    const actualpixel = 2480;

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


    let ConstColors = [
        "#33ff33",
        "#ffff4d", // yellow green
        "#ffb84d", // yellow
        "#ac7339", // orange
        "#ff1a1a", // red
        "#e2bcbd" // purple
    ];

    React.useEffect(() => {

        const bootstrapAsync = async () => {
            // let newdata=JSON.parse(rawdata);
            // console.log(newdata);
            // setData(newdata);
        };

        bootstrapAsync();
        if (data) {
            filterData(data);
            let idx = data.severities.findIndex(({ id }) => id == ncr);
            setheader(data.severities[idx]);
            sessionStorage.setItem(session, JSON.stringify(data));
        }
        else {
            let newdata = JSON.parse(sessionStorage.getItem(session)) || false
            if (newdata) {
                
            let idx = newdata.severities.findIndex(({ id }) => id == ncr);
            setheader(newdata.severities[idx]);
                filterData(newdata.checkList);
            }

        }

    }, []);

    const filterData=x=>{
        const filterData = x.filter(({ items }) =>{
           const k= items.filter(({ severity }) =>severity==ncr);
           return k.length>0;
        })
        setCklist(filterData);
        createpanes(filterData);
    }

    const createpanes=x=>{
        let newpane=[];
        for (const [index, { section, items }] of x.entries()) {

            newpane.push({ menuItem: section, render: () => <Tab.Pane><RenderCheckList items={items}/></Tab.Pane> });
        }

        setpanes(newpane);
    }

    const RenderCheckList = ({items}) => {
        console.log(items)
        return (
            <List className="cklistSection" divided verticalAlign='middle' relaxed size="small">
                <List.Item>as</List.Item>
                {items.map((item, index) =>
                  { 
                      //console.log(item);
                    let nc=ncr;
                    switch( item.type) {
                        case "CHECKLIST":
                        return <List.Item  key={index} className="cklistItem"  style={{
                                    borderLeft:` 2vw solid ${ConstColors[nc-1][0]}`, backgroundColor:item.autoFailed==="1"?"#FA8072":"transparent",
                                    }}>
                          
                        <List.Content floated='right' verticalAlign="middle">
                            <Checkbox id={`checkbox-${item.id}`} onChange={(e, data) => { }} checked={false} disabled={false}/>
                        </List.Content>
                        <List.Icon >
                            <Button circular icon='ellipsis vertical' onClick={() => {}} />
                        </List.Icon>
                        <List.Content verticalAlign="middle" className={false}>
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
                        return <List.Item  key={index} className="cklistItem"  style={{
                                    borderLeft:` 2vw solid ${ConstColors[nc-1][0]}`, backgroundColor:item.autoFailed==="1"?"#FA8072":"transparent",
                                    }}>
                          
                        <List.Content floated='right' verticalAlign="middle">
                            <Checkbox id={`checkbox-${item.id}`} onChange={(e, data) => { }} checked={false} disabled={false}/>
                        </List.Content>
                        <List.Icon >
                            <Button circular icon='ellipsis vertical' onClick={() => {}} />
                        </List.Icon>
                        <List.Content verticalAlign="middle" className={false}>
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
                    case 'TITLE':
                    return  <List.Item  className="cklistItem" >
                                <List.Header>{item.text_ms}</List.Header>
                            </List.Item>;
                    case 'LABEL':
                    return  <List.Item  className="cklistItem" >
                                <List.Header>{item.text_ms}</List.Header>
                            </List.Item>;
                    case 'NUMBER':
                        return  <List.Item  className="cklistItem" >
                                    <List.Content verticalAlign="middle">
                                    <label for={`checkbox-${item.id}`}>{item.text_ms}</label>
                                    <Input fluid type="number" value={""} placeholder='' onChange={(event) => { }} />
                                    </List.Content>
                                </List.Item>;
                    case 'TEXT':
                    return <List.Item  className="cklistItem" >
                        <List.Content verticalAlign="middle">
                        <label for={`checkbox-${item.id}`}>{item.text_ms}</label>
                        <Input fluid type="text" value={"" }  placeholder='' onChange={(event) => { }} />
                        </List.Content>
                    </List.Item>;
                    default:
                    return null;

                        }}
                )}

            </List>
        )
    }
    const startAnalyze = async ({ info, auditResult, severities, auditNotes, auditDisable, checkList, summaryNote, newNC, passRules, reportChart, reportSetting }) => {

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
                for (const [i, { id, autoFailed, severity, type, text_ms, info, autofailed }] of items.entries()) {

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
                        // else {

                        //   if (auditResult[id]) {
                        //     resultcol = auditResult[id];
                        //   }
                        // }

                        // let text = [text_ms];

                        // if (auditNotes[id]) {
                        //   text.push({ text: '\n' + t('notes') + " :", color: "#000000", bold: true });
                        //   text.push({ text: auditNotes[id], color: noteColor });
                        // }

                        //   apdxsmall.push({
                        //     text: Number(z + 1) + ") " + img
                        // });
                        // apdxsmall.push(templist2);

                        let apdxsmall = [];

                        // if (auditAttachment[id]) {
                        //     //   for (const [idx, key] of Object.keys(auditAttachment[id]).entries()) {
                        //     //     // auditAttachment[id][key]
                        //     //     // let smallimg = await ImageManipulator.manipulateAsync(
                        //     //     //   auditAttachment[id][key],
                        //     //     //   [{ resize: { width: 100} }],
                        //     //     //   { compress: 1, format: ImageManipulator.SaveFormat.JPEG,base64:true }
                        //     //     // );

                        //     //     let img = t('figure') + " " + fgrcnt;

                        //     //     apdxsmall.push({
                        //     //       text: Number(idx + 1) + ") " + img
                        //     //     });

                        //     //     apdxsmall.push({
                        //     //       image: `fgr,${fgrcnt}`, // a long dataURI string,
                        //     //       alignment: 'center',
                        //     //       width: 100,
                        //     //       margin: [0, 10, 0, 10]
                        //     //     })


                        //     //     // let largImg = await ImageManipulator.manipulateAsync(
                        //     //     //   auditAttachment[id][key],
                        //     //     //   [{ resize: { width: 300} }],
                        //     //     //   { compress: 1, format: ImageManipulator.SaveFormat.JPEG,base64:true }
                        //     //     // );

                        //     //     // if(largImg)
                        //     //     //  {
                        //     //     var templist = {
                        //     //       image: `fgr,${fgrcnt}`, // a long dataURI string,
                        //     //       alignment: 'center',
                        //     //       width: 300,
                        //     //       margin: [0, 0, 0, 5]
                        //     //     }
                        //     //     attachmentlist.push(templist);
                        //     //     attachmentlist.push({
                        //     //       text: img,
                        //     //       bold: true,
                        //     //       alignment: 'center',
                        //     //       margin: [0, 0, 0, 20]
                        //     //     });

                        //     //     fgrcnt++;
                        //     //     // }

                        //     //   }


                        //     // Object.keys(auditAttachment[id]).forEach(async(key,idx)=>{
                        //     // })
                        // }
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

            newserv.forEach(({ value, name, color, count }, i) => {
                if (count && value) {
                    piechartData.value.push(((value / total) * 360) || 0);
                    piechartData.label.push(value || 0);
                    piechartData.legend.push(name);
                    piechartData.colors.push(color == "" ? ConstColors[i + 1] : color);
                    piechartData.percent.push((((value / total) * 100) || 0).toFixed(2))
                    piechartData.count.push(count || 0);
                }
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
            //   setReportAttachment(attachmentlist);
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


   
      
    return <Container>
        <Menu fixed='top' style={{ backgroundColor: header?header.color:ConstColors[ncr] }} widths={3}>
            <Menu.Item  header name={header?header.name:'home'} />
        </Menu>
        <Segment>
        <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes} />
        </Segment></Container>
}

export default Ncr_details;


const operators = {
    '>': (a, b) => parseFloat(a) > parseFloat(b),
    '<': (a, b) => parseFloat(a) < parseFloat(b),
    // ...
};