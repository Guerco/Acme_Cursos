import { VisaoQtdAlunosPorCurso } from "./VisaoQtdAlunosPorCurso.ts";
import { ControladoraQtdAlunoPorCurso } from "../presenter/ControladoraQtdAlunoPorCurso.ts";
import { CursoQtdAlunoRel } from "../model/dto/relatorio/CursoQtdAlunoRel.ts";
import { ids } from "../ui/alunos-cursos-ui.ts";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { VisaoBaseDOM } from "./VisaoBaseDOM.ts";
import { Sessao } from "../model/sessao/Sessao.ts";
import { TipoUsuario } from "../model/TipoUsuario.ts";


import { Chart, BarController, BarElement, CategoryScale, LinearScale, PieController, ArcElement, Tooltip, Legend, ChartTypeRegistry } from "chart.js";

Chart.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    PieController,
    ArcElement,
    ChartDataLabels,
    Tooltip,
    Legend
);


export class VisaoQtdAlunosPorCursoDOM extends VisaoBaseDOM implements VisaoQtdAlunosPorCurso{
    private controladora: ControladoraQtdAlunoPorCurso;
    private chart!: Chart;
    
    constructor(private sessao: Sessao) {
        super();
        this.controladora = new ControladoraQtdAlunoPorCurso(this);
    }

    iniciar() {
        if(!this.sessao.estaLogado() ||
            !this.sessao.verificarAutorizacao([
                TipoUsuario.ADMINISTRADOR,
                TipoUsuario.PROFESSOR,
                TipoUsuario.PROFESSOR_ADMINISTRADOR
            ])
        ){
            super.redirecionaParaErro('Página não encontrada ❌');
            return; 
        }

        this.controladora.listarNumeroDeAlunosPorCurso();

        document.getElementById('tipo-grafico')!.onchange = (e) => {
            this.controladora.alternarTipoGrafico(e);
        }
    }

    // Saída
    exibirGrafico(listagem: Array<CursoQtdAlunoRel>, tipo: keyof ChartTypeRegistry): void{
        const canvas = document.getElementById(ids.canva) as HTMLCanvasElement;
        if (!canvas) return;

        const listagemOrdenada = listagem.sort((a, b) => a.quantidade - b.quantidade);

        const labels = listagemOrdenada.map(x => x.descricao);
        const valores = listagemOrdenada.map(x => x.quantidade);

        if (this.chart) {
            this.chart.destroy();
        }

        if (tipo === 'pie')
        this.chart = new Chart(canvas, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    label: 'Total Alunos',
                    data: valores,
                    backgroundColor: [
                        "#820ec0",
                        "#ff7700",
                        "#6CBF45",
                        "#0f80ddff",
                        "#d42222ff",
                        "#fdc600ff"
                    ],
                    borderWidth: 3,
                    hoverBorderWidth: 20,
                    hoverBorderColor: '#ffffff93',
                    hoverOffset: 30,
                }]
            },
            options: {
                maintainAspectRatio: false,
                onResize(chart, size) {
                    const retrato = size.height > size.width;

                    const novaPosicao = retrato ? "top" : "right";

                    if (chart.options!.plugins!.legend!.position !== novaPosicao) {
                        chart.options!.plugins!.legend!.position = novaPosicao;
                        chart.update();
                    }
                },
                plugins: {
                    legend: { 
                        display: tipo === 'pie',
                        position: "top" ,  
                        align: "start",
                        rtl: true,
                        labels:{
                            boxWidth: 20,
                            boxHeight: 20,
                            padding: 1,
                            useBorderRadius: true,
                            borderRadius: 5,
                            font:{
                                size: 13,
                                weight: 'lighter' ,
                                family: "Georgia, 'Times New Roman', serif"
                            },
                            sort: (a, b) => {
                                const tamanhoA = a.text.length;
                                const tamanhoB = b.text.length;

                                return tamanhoB - tamanhoA;
                            },
                        },
                        title: {
                            text: 'Cursos',
                            display: tipo === 'pie',
                            color: '#820ec0',
                            padding: 10,
                            font:{
                                size: 20,
                                weight: 'bold' ,
                                family: "Georgia, 'Times New Roman', serif"
                            }
                        },
                    },

                    tooltip: {
                        position:'nearest',
                        backgroundColor: '#820ec0b6',
                        titleColor: '#b7e99fff',
                        titleFont:{
                            size: 12,
                            weight: 'bold' ,
                            family: "Georgia, 'Times New Roman', serif"
                        },
                        titleAlign: "center",
                    },

                    datalabels: {
                        color: "#fff",
                        borderColor: '#ffffffff',
                        borderWidth: 1,
                        backgroundColor: '#820ec0b6',
                        borderRadius: 5,
                        clamp: false,
                        display: 'auto',
                        font: {
                            weight: "bold",
                            size: 13
                        },
                        formatter: (value, ctx) => {
                            const total = (ctx.chart.data.datasets[0].data as number[])
                             .reduce((a, b) => a + b, 0);

                            const pct = ((value / total) * 100).toFixed(0);

                            return `${pct}% (${value})`;
                        }
                    }
                }
            }
        });
        if (tipo === 'doughnut')
        this.chart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    label: 'Total Alunos',
                    data: valores,
                    backgroundColor: [
                        "#820ec0",
                        "#ff7700",
                        "#6CBF45",
                        "#0f80ddff",
                        "#d42222ff",
                        "#fdc600ff"
                    ],
                    borderWidth: 3,
                    hoverBorderWidth: 20,
                    hoverBorderColor: '#ffffff93',
                    hoverOffset: 30,
                }]
            },
            options: {
                maintainAspectRatio: false,
                onResize(chart, size) {
                    const retrato = size.height > size.width;

                    const novaPosicao = retrato ? "top" : "right";

                    if (chart!.options!.plugins!.legend!.position !== novaPosicao) {
                        chart.options!.plugins!.legend!.position = novaPosicao;
                        chart.update();
                    }
                },
                plugins: {
                    legend: { 
                        display: true,
                        position: "top" ,  
                        align: "start",
                        rtl: true,
                        labels:{
                            boxWidth: 20,
                            boxHeight: 20,
                            padding: 1,
                            useBorderRadius: true,
                            borderRadius: 5,
                            font:{
                                size: 13,
                                weight: 'lighter' ,
                                family: "Georgia, 'Times New Roman', serif"
                            },
                            sort: (a, b) => {
                                const tamanhoA = a.text.length;
                                const tamanhoB = b.text.length;

                                return tamanhoB - tamanhoA;
                            },
                        },
                        title: {
                            text: 'Cursos',
                            display: true,
                            color: '#820ec0',
                            padding: 10,
                            font:{
                                size: 20,
                                weight: 'bold' ,
                                family: "Georgia, 'Times New Roman', serif"
                            }
                        },
                    },

                    tooltip: {
                        position:'nearest',
                        backgroundColor: '#820ec0b6',
                        titleColor: '#b7e99fff',
                        titleFont:{
                            size: 12,
                            weight: 'bold' ,
                            family: "Georgia, 'Times New Roman', serif"
                        },
                        titleAlign: "center",
                    },

                    datalabels: {
                        color: "#fff",
                        borderColor: '#ffffffff',
                        borderWidth: 1,
                        backgroundColor: '#820ec0b6',
                        borderRadius: 5,
                        clamp: false,
                        display: 'auto',
                        font: {
                            weight: "bold",
                            size: 13
                        },
                        formatter: (value, ctx) => {
                            const total = (ctx.chart.data.datasets[0].data as number[])
                             .reduce((a, b) => a + b, 0);

                            const pct = ((value / total) * 100).toFixed(0);

                            return `${pct}% (${value})`;
                        }
                    }
                }
            }
        });

        else if (tipo === 'bar')
        this.chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Total Alunos',
                    data: valores,
                    backgroundColor: [
                        "#820ec0",
                        "#ff7700",
                        "#6CBF45",
                        "#0f80ddff",
                        "#d42222ff",
                        "#fdc600ff"
                    ],
                    borderWidth: 5,
                    borderColor: '#fff',
                    hoverBorderWidth: 8,
                    hoverBorderColor: '#ffffff93',
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: "Total Alunos",
                            color: "#820ec0",
                            font: {
                                size: 16,
                                weight: "bold",
                                family: "Georgia, 'Times New Roman', serif"
                            },
                            padding: 2
                        },
                        ticks: {
                            autoSkip: true,
                            count: (Math.max(...valores)+1)
                        },
                        grid: {
                            color: "#820ec0",

                        }
                    },
                    x: {
                        title: {
                            display: false,
                        },
                        ticks: {
                            display: false,
                            font: {
                                size: 10,
                                weight: "bold",
                                family: "Georgia, 'Times New Roman', serif"
                            },
                        },
                        grid: {
                            color: "#ffffff00"
                        }
                    }
                },
                plugins: {
                    legend: { 
                        display: false,
                    },

                    tooltip: {
                        position:'nearest',
                        backgroundColor: '#820ec0b6',
                        titleColor: '#b7e99fff',
                        titleFont:{
                            size: 12,
                            weight: 'bold' ,
                            family: "Georgia, 'Times New Roman', serif"
                        },
                        titleAlign: "center",
                    },

                    datalabels: {
                        rotation: 290,
                        color: "#fff",
                        borderColor: '#ffffffff',
                        borderWidth: 1,
                        backgroundColor: '#820ec0b6',
                        borderRadius: 5,
                        clamp: false,
                        display: 'auto',
                        font: {
                            weight: "lighter",
                            size: 13
                        },
                        formatter: (value, ctx) => {
                            const curso = ctx.chart!.data!.labels![ctx.dataIndex] as string;
                            return curso!.length > 20 ? curso.slice(0, 20) + '...' : curso;
                        }
                    }
                }
            }
        });
    }    
}