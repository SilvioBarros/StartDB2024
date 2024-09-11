class RecintosZoo {

    constructor() {
        this.recintos = [
            { numero: 1, bioma: "savana", tamanhoTotal: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: [{ especie: "LEAO", quantidade: 1 }] }
        ];

        this.especies = {
            "LEAO": { tamanho: 3, biomas: ["savana"], carnivoro: true },
            "LEOPARDO": { tamanho: 2, biomas: ["savana"], carnivoro: true },
            "CROCODILO": { tamanho: 3, biomas: ["rio"], carnivoro: true },
            "MACACO": { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
            "GAZELA": { tamanho: 2, biomas: ["savana"], carnivoro: false },
            "HIPOPOTAMO": { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        // Validação das entradas
        if (!this.especies[animal]) {
            return { erro: "Animal inválido" };
        }
        if (typeof quantidade !== "number" || quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }
    
        const especie = this.especies[animal];
        const tamanhoNecessario = especie.tamanho * quantidade;
    
        // Filtrar recintos compatíveis
        const recintosViaveis = this.recintos.filter(recinto => {
            // Verificar se o bioma é compatível
            if (!especie.biomas.includes(recinto.bioma) && !(recinto.bioma === "savana e rio" && especie.biomas.includes("savana"))) {
                return false;
            }
    
            // Calcular o espaço ocupado pelos animais existentes no recinto
            let espacoOcupado = recinto.animais.reduce((soma, { especie: especieExistente, quantidade }) => {
                return soma + this.especies[especieExistente].tamanho * quantidade;
            }, 0);
    
            // Verificar se há espaço suficiente para os novos animais
            if (tamanhoNecessario + espacoOcupado > recinto.tamanhoTotal) {
                return false;
            }
    
            // Regras específicas para carnívoros
            if (especie.carnivoro) {
                // Carnívoros só podem ficar com a própria espécie
                if (recinto.animais.some(a => a.especie !== animal)) {
                    return false;
                }
            } else {
                // Não carnívoros não podem conviver com carnívoros
                if (recinto.animais.some(a => this.especies[a.especie].carnivoro)) {
                    return false;
                }
            }
    
            // Regras específicas para hipopótamos
            if (animal === "HIPOPOTAMO") {
                // Hipopótamos só toleram outras espécies em savana e rio
                if (recinto.bioma !== "savana e rio" && recinto.animais.length > 0) {
                    return false;
                }
            }
    
            // Regras específicas para macacos
            if (animal === "MACACO" && quantidade === 1) {
                // Um macaco não se sente confortável sozinho
                if (recinto.animais.length === 0) {
                    return false;
                }
            }
    
            // Adicionar espaço extra apenas se há convivência entre espécies diferentes e não carnívoras
            if (recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== animal && !this.especies[a.especie].carnivoro)) {
                espacoOcupado += 1;
            }
    
            // Revalidar se ainda cabe com o espaço extra
            if (tamanhoNecessario + espacoOcupado > recinto.tamanhoTotal) {
                return false;
            }
    
            return true;
        }).map(recinto => {
            // Calcular o espaço ocupado pelos animais existentes no recinto
            let espacoOcupado = recinto.animais.reduce((soma, { especie: especieExistente, quantidade }) => {
                return soma + this.especies[especieExistente].tamanho * quantidade;
            }, 0);
    
            // Adicionar o espaço necessário para o novo lote de animais
            espacoOcupado += tamanhoNecessario;
    
            // Adicionar espaço extra apenas se há convivência entre espécies diferentes e não carnívoras
            if (recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== animal && !this.especies[a.especie].carnivoro)) {
                espacoOcupado += 1;
            }
    
            // Calcular o espaço livre restante
            const espacoLivre = recinto.tamanhoTotal - espacoOcupado;
    
            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
        });
    
        // Se não há recintos viáveis
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }
    
        // Ordenar recintos viáveis por número do recinto
        recintosViaveis.sort((a, b) => parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]));
    
        // Retornar recintos viáveis
        return { recintosViaveis };
    }
    
}

export { RecintosZoo as RecintosZoo };