<?php

class RepositorioCredenciaisEmBDR implements RepositorioCredenciais{

    public function __construct(
        private PDO $pdo
    ){}

    public function adicionar(Credenciais $credenciais): int{
        try{
            $ps = $this->pdo->prepare(
            'insert into credenciais (email, senha, salSenha) 
                values (:email, :senha, :salSenha)'
            );
            $ps->execute([
                'email' => $credenciais->getEmail(),
                'senha' => $credenciais->getSenha(),
                'salSenha' => $credenciais->getSalSenha()
            ]);
            $idCredenciais = $this->pdo->lastInsertId();

            return (int) $idCredenciais;
        } catch (PDOException $e){
            throw new RepositorioException ($e->getMessage());
        }    
    }

    public function buscarPorEmail(string $email) :bool {
        try{
            $ps = $this->pdo->prepare(
            'select email from credenciais c 
                where c.email = :email'
            );
            $ps->execute([
                'email' => $email
            ]);
            $resultado = $ps->fetch();

            return $resultado !== false;

            return false;
        } catch (PDOException $e){
            throw new RepositorioException ($e->getMessage());
        } 
    }

    public function listarTodos(): array{
        try{
            $ps = $this->pdo->prepare(
                'select 
                    case 
                       when a.id is not null then "Aluno"
				       when p.id is not null and adm.id is not null then "Professor-Administrador"
				       when p.id is not null then "Professor"
				       when adm.id is not null then "Administrador"
                    end as tipo_usuario,
                    case
                        when a.nome is not null then a.nome
                        when p.nome is not null then p.nome
                        when adm.nome is not null then adm.nome
                    end as nome,
                    c.email 
                    from credenciais c
                    left join aluno a on (c.id = a.id_credenciais)
                    left join professor p on (c.id = p.id_credenciais)
                    left join administrador adm on (c.id = adm.id_credenciais) 
                    order by tipo_usuario, nome' 
            );
            $ps->execute();

            $dados = $ps->fetchAll();
            $usuarios = $this->criarUsuarios($dados);

            return $usuarios;
        } catch (PDOException $e){
            throw new RepositorioException ($e->getMessage());
        }
    }

    private function criarUsuarios(array $usuarios):array{
        $usuariosCriados = [];
        
        foreach ($usuarios as $u){
            $credenciais = new Credenciais();
            $credenciais->setEmail($u['email']);

            switch ($u['tipo_usuario']) {
                case 'Administrador':
                    $usuario = new Administrador();
                    break;
                case 'Professor':
                    $usuario = new Professor();
                    break;
                case 'Aluno':
                    $usuario = new Aluno();
                    break;
                case 'Professor-Administrador':
                    $usuario = new ProfessorAdministrador();
                    break;
                default:
                    throw new RepositorioException('O tipo de usuário não existe.');
            }

            $usuario->setNome($u['nome']);
            $usuario->setCredenciais($credenciais);
            $usuariosCriados[] = $usuario;
        }
        return $usuariosCriados;
    }
}