import { VisaoQtdAlunosPorCurso } from "./VisaoQtdAlunosPorCurso.ts";
import { ControladoraQtdAlunoPorCurso } from "../presenter/ControladoraQtdAlunoPorCurso.ts";
import { CursoQtdAlunoRel } from "../model/dto/relatorio/CursoQtdAlunoRel.ts";
import { Chart, ArcElement, Tooltip, Legend, PieController } from "chart.js";
import { ids } from "../ui/alunos-cursos-ui.ts";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { VisaoBaseDOM } from "./VisaoBaseDOM.ts";
import { Sessao } from "../model/sessao/Sessao.ts";
import { TipoUsuario } from "../model/TipoUsuario.ts";

Chart.register(ArcElement, Tooltip, Legend, PieController, ChartDataLabels);

export class VisaoQtdAlunosPorCursoDOM extends VisaoBaseDOM implements VisaoQtdAlunosPorCurso{
    private controladora: ControladoraQtdAlunoPorCurso;
    
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
    }

    // Saída
    exibirGrafico(listagem: Array<CursoQtdAlunoRel>): void{
        const canvas = document.getElementById(ids.canva) as HTMLCanvasElement;
        if (!canvas) return;

        const labels = listagem.map(x => x.descricao);
        const valores = listagem.map(x => x.quantidade);

        new Chart(canvas, {
            type: "pie",
            data: {
                labels,
                datasets: [{
                    data: valores,
                    backgroundColor: [
                        "#4e79a7",
                        "#f28e2b",
                        "#e15759",
                        "#76b7b2",
                        "#59a14f",
                        "#edc949"
                    ]
                }]
            },
            options: {
                plugins: {
                    legend: { position: "right" },

                    datalabels: {
                        color: "#fff",
                        font: {
                            weight: "bold",
                            size: 14
                        },
                        formatter: (value, ctx) => {
                            const total = (ctx.chart.data.datasets[0].data as number[])
                             .reduce((a, b) => a + b, 0);

                            const pct = ((value / total) * 100).toFixed(1);

                            return `${value} (${pct}%)`;
                        }
                    }
                }
            }
        });
    }    
}