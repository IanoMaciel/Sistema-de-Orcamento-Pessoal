class Despesa
{
    constructor(ano, mes, dia, tipo, descricao, valor)
    {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados()
    {   
        //percorrendo elementos no proprio object
        for (let i in this) {
           if(this[i] == undefined || this[i] == '' || this[i] == null)
               return false;
        }
        return true;
    }

    limparCampo()
    {
        let ano = document.getElementById('ano').value = '';
        let mes = document.getElementById('mes').value = '';
        let dia = document.getElementById('dia').value = '';
        let tipo = document.getElementById('tipo').value = '';
        let descricao = document.getElementById('descricao').value = '';
        let valor = document.getElementById('valor').value = ''
    }
}

class Bd
{
    constructor()
    {
        let id = localStorage.getItem('id');
        
        if(id === null)
            localStorage.setItem('id', 0);
    }

    getProximoId()
    {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(d)
    {
        let id = this.getProximoId();

        localStorage.setItem(id, JSON.stringify(d));

        localStorage.setItem('id',id);
    }

    recuperarTodosRegistros()
    {
        //array de despesas
        let despesas = Array();
        let id = localStorage.getItem('id');

        for(let i = 1; i <= id; i++)
        {
            let despesa = JSON.parse(localStorage.getItem(i));

            //testar de se tem índices que foram pulados/removidos
            if(despesa === null)
                continue;

            //adiciona o object literal no array despesas
            despesa.id = i;
            despesas.push(despesa);
        }
        return despesas;
    }

    pesquisar(despesa)
    {
        let despesasFiltradas = Array(); 

        despesasFiltradas = this.recuperarTodosRegistros();
        
        //console.log(despesa)

        //console.log(despesasFiltradas)
        
        //ano
        if(despesa.ano != '')
            despesasFiltradas = despesasFiltradas.filter(i => i.ano == despesa.ano);
        //mes
        if(despesa.mes != '')
            despesasFiltradas = despesasFiltradas.filter(i => i.mes == despesa.mes);
        //dia
        if(despesa.dia != '')
            despesasFiltradas = despesasFiltradas.filter(i => i.dia == despesa.dia);
        //tipo
        if(despesa.tipo != '')
            despesasFiltradas = despesasFiltradas.filter(i => i.tipo == despesa.tipo);
        //descrição 
        if(despesa.descricao != '')
            despesasFiltradas = despesasFiltradas.filter(i => i.descricao == despesa.descricao);
        //valor 
        if(despesa.valor != '')
            despesasFiltradas = despesasFiltradas.filter(i => i.valor == despesa.valor);

        return despesasFiltradas;
    }

    remover(id)
    {
        localStorage.removeItem(id);
    }
}

let bd = new Bd();

function cadastrarDispesa()
{
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    if(despesa.validarDados())
    {
        bd.gravar(despesa);

        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso!';
        document.getElementById('modal_titulo_div').className = 'modal-header text-success';
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!';
        document.getElementById('modal_btn').innerHTML = 'Voltar';
        document.getElementById('modal_btn').className = 'btn btn-success';

        $('#modalRegistroDespesa').modal('show');

        despesa.limparCampo();
    } else {

        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro!';
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger';
        document.getElementById('modal_conteudo').innerHTML = 'Erro ao registrar. Verefique se todos os campos foram preenchidos corretamente!';
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir';
        document.getElementById('modal_btn').className = 'btn btn-danger';

        $('#modalRegistroDespesa').modal('show');
    }
}

function verificaTipo(tipo)
{
    if(tipo == 1)
        return 'Alimentação';
    else if(tipo == 2)
        return 'Educação';
    else if(tipo == 3)
        return 'Lazer';
    else if(tipo == 4)
        return 'Saúde';
    else if(tipo == 5)
        return 'Transporte';
}

function carregaListaDespesas(despesas = Array(), filtro = false)
{   
    if(despesas.length == 0 && filtro == false)
    {
        despesas = bd.recuperarTodosRegistros();
    }
    //selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    //percorrendo o array despesas, listando cada despesas de forma dinâmica
    despesas.forEach(function(i)
    {   
        //criando a linha (tr)
        let linha = listaDespesas.insertRow();    
        
        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${i.dia} - ${i.mes} - ${i.ano}`;
        
        let tipo = verificaTipo(i.tipo);
        linha.insertCell(1).innerHTML = tipo; 

        linha.insertCell(2).innerHTML = i.descricao;
        linha.insertCell(3).innerHTML = i.valor;
        
        //criar o botão de exclusão
        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `id_despesa_${i.id}`;
        
        btn.onclick = function()
        {
            let id = this.id.replace('id_despesa_', '');

            bd.remover(id);

            window.location.reload(); 
            
        }
    
        linha.insertCell(4).append(btn);
        console.log(i);
    });    
}

function pesquisarDespesa()
{
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa);

    this.carregaListaDespesas(despesas, true);

}