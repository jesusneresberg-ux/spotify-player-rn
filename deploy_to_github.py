#!/usr/bin/env python3
"""
📤 Script para publicar projeto Spotify Player no GitHub
Uso: python3 deploy_to_github.py <TOKEN> <USERNAME> [REPO_NAME]
"""

import os
import sys
import json
import subprocess
from pathlib import Path
import requests

# Cores
class Colors:
    GREEN = '\033[92m'
    BLUE = '\033[94m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_step(step_num, message):
    """Imprimir passo numerado"""
    print(f"\n{Colors.BLUE}📋 Step {step_num}/5: {message}{Colors.END}")

def print_success(message):
    """Imprimir mensagem de sucesso"""
    print(f"{Colors.GREEN}✅ {message}{Colors.END}")

def print_error(message):
    """Imprimir mensagem de erro"""
    print(f"{Colors.RED}❌ {message}{Colors.END}")

def print_warning(message):
    """Imprimir aviso"""
    print(f"{Colors.YELLOW}⚠️  {message}{Colors.END}")

def validate_args():
    """Validar argumentos da linha de comando"""
    if len(sys.argv) < 3:
        print_error("Argumentos insuficientes")
        print("\nUso: python3 deploy_to_github.py <TOKEN> <USERNAME> [REPO_NAME]")
        print("\nExemplo:")
        print("  python3 deploy_to_github.py ghp_xxxxxxxxxxxx berg- spotify-player-rn")
        sys.exit(1)

    token = sys.argv[1]
    username = sys.argv[2]
    repo_name = sys.argv[3] if len(sys.argv) > 3 else "spotify-player-rn"

    return token, username, repo_name

def create_repository(token, username, repo_name):
    """Criar repositório no GitHub via API"""
    print_step(1, "Criando repositório no GitHub...")

    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json"
    }

    data = {
        "name": repo_name,
        "description": "Full-featured Spotify player for React Native/Expo",
        "homepage": f"https://github.com/{username}/{repo_name}",
        "private": False,
        "has_issues": True,
        "has_projects": True,
        "has_downloads": True,
        "auto_init": False
    }

    try:
        response = requests.post(
            "https://api.github.com/user/repos",
            headers=headers,
            json=data,
            timeout=10
        )

        if response.status_code in [201, 422]:  # 422 = already exists
            if response.status_code == 201:
                print_success("Repositório criado com sucesso!")
            else:
                print_warning("Repositório pode já existir. Continuando...")
            return True
        else:
            print_error(f"Erro ao criar repositório: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print_error(f"Erro na requisição: {str(e)}")
        return False

def init_git():
    """Inicializar repositório Git"""
    print_step(2, "Inicializando Git...")

    if Path(".git").exists():
        print_warning("Repositório Git já existe. Pulando init...")
        return True

    try:
        subprocess.run(["git", "init"], check=True, capture_output=True)
        print_success("Git inicializado")
        return True
    except Exception as e:
        print_error(f"Erro ao inicializar Git: {str(e)}")
        return False

def add_and_commit():
    """Adicionar arquivos e fazer commit"""
    print_step(3, "Adicionando arquivos...")

    try:
        # Configurar git
        subprocess.run(
            ["git", "config", "user.email", "github@example.com"],
            check=True,
            capture_output=True
        )
        subprocess.run(
            ["git", "config", "user.name", "GitHub Publisher"],
            check=True,
            capture_output=True
        )

        # Adicionar
        subprocess.run(["git", "add", "."], check=True, capture_output=True)
        print_success("Arquivos adicionados")

        print_step(4, "Fazendo commit inicial...")

        result = subprocess.run(
            ["git", "commit", "-m", "feat: initial commit - Spotify player React Native implementation"],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            print_success("Commit feito")
        else:
            print_warning("Nada novo para commitar")

        return True
    except Exception as e:
        print_error(f"Erro ao fazer commit: {str(e)}")
        return False

def push_to_github(token, username, repo_name):
    """Fazer push para GitHub"""
    print_step(5, "Enviando para GitHub...")

    try:
        # Remover remote existente
        subprocess.run(
            ["git", "remote", "remove", "origin"],
            capture_output=True
        )

        # Adicionar novo remote
        remote_url = f"https://{token}@github.com/{username}/{repo_name}.git"
        subprocess.run(
            ["git", "remote", "add", "origin", remote_url],
            check=True,
            capture_output=True
        )

        # Renomear branch
        subprocess.run(
            ["git", "branch", "-M", "main"],
            check=True,
            capture_output=True
        )

        # Push
        result = subprocess.run(
            ["git", "push", "-u", "origin", "main"],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            print_success("Push concluído com sucesso!")
            return True
        else:
            print_error(f"Erro ao fazer push: {result.stderr}")
            return False
    except Exception as e:
        print_error(f"Erro: {str(e)}")
        return False

def configure_topics(token, username, repo_name):
    """Configurar topics no GitHub"""
    print("\nConfigurando topics no GitHub...")

    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.mercy-preview+json"
    }

    data = {
        "names": ["spotify", "react-native", "expo", "music-player", "oauth", "typescript"]
    }

    try:
        response = requests.put(
            f"https://api.github.com/repos/{username}/{repo_name}/topics",
            headers=headers,
            json=data,
            timeout=10
        )

        if response.status_code == 200:
            print_success("Topics configurados")
            return True
        else:
            print_warning(f"Não foi possível configurar topics (código: {response.status_code})")
            return False
    except Exception as e:
        print_warning(f"Erro ao configurar topics: {str(e)}")
        return False

def print_final_info(username, repo_name):
    """Imprimir informações finais"""
    print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 Projeto publicado com sucesso!{Colors.END}\n")

    repo_url = f"https://github.com/{username}/{repo_name}"
    print(f"{Colors.BLUE}📍 Seu repositório está em:{Colors.END}")
    print(f"   {Colors.BOLD}{repo_url}{Colors.END}\n")

    print(f"{Colors.BLUE}🎯 Próximos passos:{Colors.END}")
    print("   1. Visitar o repositório no GitHub")
    print("   2. Adicionar badges ao README (opcional)")
    print("   3. Compartilhar nas redes sociais\n")

    print(f"{Colors.YELLOW}💡 Comandos úteis:{Colors.END}")
    print("   git pull origin main              # Trazer atualizações")
    print("   git checkout -b feature/novo      # Criar nova feature")
    print("   git push origin feature/novo      # Enviar branch\n")

    print(f"{Colors.GREEN}✨ Pronto! Seu projeto está no GitHub!{Colors.END}\n")

def main():
    """Função principal"""
    print(f"\n{Colors.BLUE}{Colors.BOLD}📤 Publicador GitHub - Spotify Player React Native{Colors.END}\n")

    # Validar
    token, username, repo_name = validate_args()

    print(f"{Colors.YELLOW}ℹ️  Configuração:{Colors.END}")
    print(f"   GitHub Username: {username}")
    print(f"   Repository Name: {repo_name}")
    print(f"   Token: {token[:10]}...\n")

    # Executar passos
    if not create_repository(token, username, repo_name):
        sys.exit(1)

    if not init_git():
        sys.exit(1)

    if not add_and_commit():
        sys.exit(1)

    if not push_to_github(token, username, repo_name):
        sys.exit(1)

    # Configurar extras
    configure_topics(token, username, repo_name)

    # Informações finais
    print_final_info(username, repo_name)

if __name__ == "__main__":
    main()
