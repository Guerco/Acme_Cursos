<?php

enum TipoUsuario : string {
    case ALUNO = 'aluno';
    case PROFESSOR = 'professor';
    case ADMINISTRADOR = 'administrador';
    case PROFESSOR_ADMINISTRADOR = 'professor-administrador';

    public static function tipoObjeto(Professor|Aluno|Administrador|ProfessorAdministrador $objeto): TipoUsuario|false{
        $classe = get_class($objeto);
    
        if (strpos($classe, 'Aluno') !== false) {
            return self::ALUNO;
        } else if (strpos($classe, 'ProfessorAdministrador') !== false) {
            return self::PROFESSOR_ADMINISTRADOR;
        } else if (strpos($classe, 'Professor') !== false) {
            return self::PROFESSOR;
        } else if (strpos($classe, 'Administrador') !== false) {
            return self::ADMINISTRADOR;
        } else {
            return false;
        }
    }
}