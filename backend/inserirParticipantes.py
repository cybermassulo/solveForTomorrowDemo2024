from faker import Faker
import random
import pymysql

DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "root"
DB_DATABASE = "db_solvefortomorrow"

def gerar_dados_fake(tabela):
    
    conn = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_DATABASE
    )
    print("Connection to MySQL database successful!")
    cursor = conn.cursor()

    fake = Faker()

    for _ in range(50):
        if tabela == "orientadores":
            sql = f"INSERT INTO orientadores (nome, email, instituicao) VALUES ('{fake.name()}', '{fake.email()}', '{fake.company()}')"
        elif tabela == "participantes":
            sql = f"INSERT INTO participantes (nome, email, colegio, cidade, projeto_id) VALUES ('{fake.name()}', '{fake.email()}', '{fake.company()}', '{fake.city()}', {random.randint(1, 4)})"
        elif tabela == "projetos":
            sql = f"INSERT INTO projetos (nome, descricao) VALUES ('{fake.name()}', '{fake.text()}')"
        else:
            raise ValueError(f"Tabela '{tabela}' não suportada para geração de dados.")
        cursor.execute(sql)

    conn.commit()
    cursor.close()
    conn.close()

# Exemplo de uso:
tabela = "projetos"
sql = gerar_dados_fake(tabela)