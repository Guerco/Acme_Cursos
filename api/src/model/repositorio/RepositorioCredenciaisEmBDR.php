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

    public function buscarPorEmail(string $email) :bool|string {
        try{
            $ps = $this->pdo->prepare(
            'select salSenha from credenciais c 
                where c.email = :email'
            );
            $ps->execute([
                'email' => $email
            ]);

            $salSenha = $ps->fetchColumn();

            if ($salSenha === false) return false; 
            return (string) $salSenha;
        } catch (PDOException $e){
            throw new RepositorioException ($e->getMessage());
        } 
    }

    public function listarTodos(string $filtro): array{
        try{
            $sql = <<<'SQL'
                SELECT 
                    CASE 
                        WHEN a.id IS NOT NULL THEN 'Aluno'
                        WHEN p.id IS NOT NULL AND adm.id IS NOT NULL THEN 'Professor-Administrador'
                        WHEN p.id IS NOT NULL THEN 'Professor'
                        WHEN adm.id IS NOT NULL THEN 'Administrador'
                    END AS tipo_usuario,
                    
                    CASE
                        WHEN a.nome IS NOT NULL THEN a.nome
                        WHEN p.nome IS NOT NULL THEN p.nome
                        WHEN adm.nome IS NOT NULL THEN adm.nome
                    END AS nome,
                    
                    c.email 
                FROM credenciais c
                LEFT JOIN aluno a ON c.id = a.id_credenciais
                LEFT JOIN professor p ON c.id = p.id_credenciais
                LEFT JOIN administrador adm ON c.id = adm.id_credenciais
                WHERE 
                    LOWER(a.nome) LIKE LOWER(:filtro_aluno) 
                    OR LOWER(p.nome) LIKE LOWER(:filtro_professor) 
                    OR LOWER(adm.nome) LIKE LOWER(:filtro_adm)
                ORDER BY tipo_usuario, nome;

            SQL;
            $ps = $this->pdo->prepare($sql);

            $filtro = '%'.trim($filtro).'%';

            $ps->execute([
                'filtro_aluno' => $filtro,
                'filtro_professor' => $filtro,
                'filtro_adm' => $filtro,
            ]);

            $dados = $ps->fetchAll();
            $usuarios = $this->criarUsuarios($dados);

            return $usuarios;
        } catch (PDOException $e){
            throw new RepositorioException ($e->getMessage());
        }
    }

    public function verificarCredenciais(Credenciais $credenciais): Professor|Aluno|Administrador|ProfessorAdministradorVO|false {
        try{
            $sql = <<<'SQL'
                SELECT
                    CASE
                        WHEN a.id IS NOT NULL THEN 'Aluno'
                        WHEN p.id IS NOT NULL AND adm.id IS NOT NULL THEN 'Professor-Administrador'
                        WHEN p.id IS NOT NULL THEN 'Professor'
                        WHEN adm.id IS NOT NULL THEN 'Administrador'
                    END AS tipo_usuario,

                    CASE
                        WHEN a.nome IS NOT NULL THEN a.nome
                        WHEN p.nome IS NOT NULL THEN p.nome
                        WHEN adm.nome IS NOT NULL THEN adm.nome
                    END AS nome,

                    CASE
                        WHEN a.id IS NOT NULL THEN a.id
                        WHEN p.id IS NOT NULL THEN p.id
                        WHEN adm.id IS NOT NULL THEN adm.id
                    END AS id_usuario,

                    c.email
                FROM credenciais c
                LEFT JOIN aluno a ON (c.id = a.id_credenciais)
                LEFT JOIN professor p ON (c.id = p.id_credenciais)
                LEFT JOIN administrador adm ON (c.id = adm.id_credenciais)
                
                WHERE
                    c.email = :email
                    AND c.senha = :senha
            SQL;

            $ps = $this->pdo->prepare(
                $sql
            );
            $ps->execute([
                'email'=> $credenciais->getEmail(),
                'senha'=> $credenciais->getSenha()
            ]);

            $dados = $ps->fetch();

            if ($dados === false) return false;

            $usuario = $this->criarUsuario($dados);

            return $usuario;
        } catch (PDOException $e){
            throw new RepositorioException ('Não foi possível verificar as credenciais.');
        }
    }


    /**
     * @param array{nome: string, email: string, tipo_usuario: string}[] $usuarios
     * @throws \RepositorioException
     * @return array<Administrador|Aluno|Professor|ProfessorAdministradorVO>
     */
    private function criarUsuarios(array $usuarios):array{
        $usuariosCriados = [];
        
        foreach ($usuarios as $u){
            $usuariosCriados[] = $this->criarUsuario($u);
        }
        
        return $usuariosCriados;
    }

    /**
     * @param array{
     *     nome: string,
     *     email: string,
     *     tipo_usuario: string,
     *     id_usuario?: int
     * } $usuario
     * @throws \RepositorioException
     * @return Administrador|Aluno|Professor|ProfessorAdministradorVO
     */
    private function criarUsuario(array $usuario): Administrador|Aluno|Professor|ProfessorAdministradorVO {
        $credenciais = new Credenciais();
        $credenciais->setEmail($usuario['email']);

        switch ($usuario['tipo_usuario']) {
            case 'Administrador':
                $usuarioObj = new Administrador();
                break;
            case 'Professor':
                $usuarioObj = new Professor();
                break;
            case 'Aluno':
                $usuarioObj = new Aluno();
                break;
            case 'Professor-Administrador':
                $usuarioVO = new ProfessorAdministradorVO(
                    ($usuario['id_usuario']) ?? 0,
                    $usuario['nome'],
                    $credenciais
                );
                return $usuarioVO;
            default:
                throw new RepositorioException('O tipo de usuário não existe.');
        }

        $usuarioObj->setNome($usuario['nome']);
        $usuarioObj->setCredenciais($credenciais);

        if (isset($usuario['id_usuario'])) $usuarioObj->setId(
            (int) $usuario['id_usuario']
        );
        
        return $usuarioObj;
    }
}