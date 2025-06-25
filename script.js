document.addEventListener('DOMContentLoaded', function() {

    // --- CHATBOT ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');
    const faqQuestions = document.querySelectorAll('.faq-question');
    const faqAnswerContainer = document.getElementById('faq-answer-container');
    const faqAnswer = document.getElementById('faq-answer');
    const faqContainer = document.getElementById('chatbot-faq-container');
    const backToQuestionsBtn = document.getElementById('back-to-questions');
    let typingTimeout;

   
    const renderer = new marked.Renderer();

  
    renderer.code = (code, language, escaped) => {
      
        return `<p>${code}</p>`;
    };

    
    renderer.codespan = (code) => {
       
        return code;
    };

    
    marked.setOptions({
        renderer: renderer,
        gfm: true, 
        breaks: true 
    });

    const faqs = {
        "le-chatelier": `
            Imagina un sube y baja perfectamente equilibrado. El **Principio de Le Chatelier** dice que si pones más peso en un lado (un "cambio"), el sube y baja se moverá para reequilibrarse. En química es igual:
            - **Si añades más de un ingrediente (reactivo):** La reacción "se inclina" para crear más producto y gastar lo que añadiste.
            - **Si aumentas la presión (aprietas el espacio):** La reacción se va hacia el lado que ocupa menos espacio (el que tiene menos moléculas de gas).
            - **Si subes la temperatura:** La reacción se va en la dirección que "enfría" las cosas, es decir, la que consume calor (la dirección endotérmica).
        `,
        "ice-table": `
            Una tabla **ICE** es como una receta de cocina para la química. Te ayuda a organizar todo antes, durante y después de la reacción.
            1.  **I (Inicial):** Anotas los "ingredientes" que tienes al principio (concentraciones o presiones iniciales).
            2.  **C (Cambio):** Anotas cuánto va a cambiar cada cosa. Usamos "x" para la cantidad desconocida. Los reactivos se gastan (-x) y los productos se crean (+x). ¡Multiplica por su número en la ecuación! (ej: -2x, +3x).
            3.  **E (Equilibrio):** Sumas las dos filas de arriba (Inicial + Cambio) para saber cómo queda todo al final. Es el "plato terminado".
        `,
        "kc-kp": `
            **Kc y Kp** son como "calificaciones" que le damos a una reacción en equilibrio. Nos dicen si al final habrá más productos o más reactivos.
            - **Kc (para concentraciones):** Se usa cuando mides los ingredientes en moles por litro (en líquidos). Es como medir ingredientes en tazas.
            - **Kp (para presiones):** Se usa solo para gases. Es como medir los ingredientes por la "fuerza" que hacen contra las paredes del recipiente (presión).
            
            Básicamente, ambas miden lo mismo (la proporción productos/reactivos), pero en unidades diferentes, como medir una distancia en metros o en pies.
        `,
        "what-is-x": `
            La **"x"** es nuestra incógnita, ¡el número mágico que queremos encontrar! Representa la cantidad exacta de reactivos que se transforman en productos para alcanzar el equilibrio.
            
            Imagina que tienes 10 galletas (reactivos) y quieres hacer paquetes de 2 (productos). La "x" sería cuántas galletas usas. Si usas 6 galletas (cambio = -6), te quedan 4 (equilibrio) y creas 3 paquetes (cambio = +3).
            
            En la tabla ICE, "x" nos ayuda a relacionar el cambio de todas las sustancias. Si encontramos el valor de "x", ¡podemos calcular todo lo demás!
        `,
        "how-to-solve": `
            ¡Claro! Sigue estos pasos:
            1.  **Escribe la ecuación balanceada.** ¡Asegúrate de que haya la misma cantidad de átomos a cada lado!
            2.  **Prepara tu tabla ICE.** Anota las concentraciones o presiones iniciales que te da el problema.
            3.  **Define el Cambio con "x".** Los reactivos son "-ax" y los productos son "+bx" (donde 'a' y 'b' son sus coeficientes).
            4.  **Usa el dato clave.** El problema siempre te dará un dato en el equilibrio (ej: "al final, hay 0.5 M de NH3"). Usa ese dato para plantear una ecuación y resolver para "x".
            5.  **Calcula todo en el equilibrio.** Una vez que tengas "x", sustitúyelo en la fila "E" de tu tabla para encontrar todas las concentraciones/presiones finales.
            6.  **Calcula K.** Pon los valores de equilibrio en la fórmula de la constante (Kc o Kp) y ¡listo!
        `,
        "show-example": `
            ¡Por supuesto! En la página principal, justo debajo de la sección de Teoría, hay una sección llamada **"💡 Ejemplo Resuelto"**.
            
            Ahí encontrarás un problema completo resuelto paso a paso, con su tabla ICE y todos los cálculos explicados. ¡Es una ótima forma de ver todo en acción!
        `
    };

    function showQuestions() {
        faqContainer.classList.remove('hidden');
        faqAnswerContainer.classList.add('hidden');
        faqAnswer.innerHTML = '';
        if(typingTimeout) clearTimeout(typingTimeout);
    }

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('hidden');
       
        showQuestions();
    });
    closeChatbot.addEventListener('click', () => chatbotWindow.classList.add('hidden'));
    backToQuestionsBtn.addEventListener('click', showQuestions);

    function typeWriter(plainText, fullHtml, i = 0) {
        if (i < plainText.length) {
            
            faqAnswer.innerHTML = plainText.substring(0, i + 1) + '<span class="cursor">|</span>';
            typingTimeout = setTimeout(() => typeWriter(plainText, fullHtml, i + 1), 20);
        } else {
             faqAnswer.innerHTML = fullHtml; 
        }
    }

    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const topic = button.dataset.topic;
            if (topic) {
                faqContainer.classList.add('hidden');
                faqAnswerContainer.classList.remove('hidden');
                
                const fullHtml = marked.parse(faqs[topic]); 
                
                
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = fullHtml;
                const plainText = tempDiv.textContent.trim(); 

                typeWriter(plainText, fullHtml); 
            }
        });
    });

   
    const equationInput = document.getElementById('equation');
    const speciesInputsContainer = document.getElementById('species-inputs');
    const equilibriumSpeciesSelect = document.getElementById('equilibrium-species');
    const equilibriumValueInput = document.getElementById('equilibrium-value');
    const form = document.getElementById('equilibrium-calculator');
    const resultContainer = document.getElementById('result-container');
    const iceTableContainer = document.getElementById('ice-table-container');
    const calculationStepsContainer = document.getElementById('calculation-steps');
    const equilibriumTypeSelect = document.getElementById('equilibrium-type');
    const gasSpecificInputs = document.getElementById('gas-specific-inputs');
    const errorContainer = document.getElementById('calculator-error');

    equationInput.addEventListener('input', setupSpeciesInputs);
    
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');
    }

    function clearError() {
        errorContainer.classList.add('hidden');
    }

    function setupSpeciesInputs() {
        clearError();
        const equation = equationInput.value;
        const parsed = parseEquation(equation);
        
        speciesInputsContainer.innerHTML = '';
        equilibriumSpeciesSelect.innerHTML = '<option value="">-- Selecciona una especie --</option>';

        if (!parsed) {
            equilibriumSpeciesSelect.disabled = true;
            equilibriumValueInput.disabled = true;
            return;
        }

        const allSpecies = [...parsed.reactants, ...parsed.products];
        const units = equilibriumTypeSelect.value === 'kc' ? '(mol/L)' : '(atm)';

        let legend = document.createElement('legend');
        legend.textContent = `3. Concentraciones/Presiones Iniciales ${units}`;
        speciesInputsContainer.appendChild(legend);

        allSpecies.forEach(species => {
           
            const group = document.createElement('div');
            group.classList.add('input-group');
            const label = document.createElement('label');
            label.textContent = `${species.name}`;
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `initial-${species.name}`;
            input.placeholder = `Inicial de ${species.name}`;
            input.step = 'any';
            input.min = '0';
            input.required = true;
            group.appendChild(label);
            group.appendChild(input);
            speciesInputsContainer.appendChild(group);

            
            const option = document.createElement('option');
            option.value = species.name;
            option.textContent = species.name;
            equilibriumSpeciesSelect.appendChild(option);
        });

        equilibriumSpeciesSelect.disabled = false;
        equilibriumValueInput.disabled = false;
    }
    
    equilibriumTypeSelect.addEventListener('change', () => {
        if(equilibriumTypeSelect.value === 'kp'){
            gasSpecificInputs.classList.remove('hidden');
        } else {
            gasSpecificInputs.classList.add('hidden');
        }
        setupSpeciesInputs();
    });

    function parseChemicalFormula(formula) {
        const atoms = {};
        const regex = /([A-Z][a-z]*)(\d*)/g;
        let match;
        while ((match = regex.exec(formula)) !== null) {
            const element = match[1];
            const count = parseInt(match[2] || '1', 10);
            atoms[element] = (atoms[element] || 0) + count;
        }
        return atoms;
    }

    function isEquationBalanced(parsed) {
        const reactantAtoms = {};
        const productAtoms = {};

        parsed.reactants.forEach(species => {
            const atoms = parseChemicalFormula(species.name);
            for (const element in atoms) {
                reactantAtoms[element] = (reactantAtoms[element] || 0) + atoms[element] * species.coeff;
            }
        });

        parsed.products.forEach(species => {
            const atoms = parseChemicalFormula(species.name);
            for (const element in atoms) {
                productAtoms[element] = (productAtoms[element] || 0) + atoms[element] * species.coeff;
            }
        });

        const allElements = new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)]);

        for (const element of allElements) {
            if (reactantAtoms[element] !== productAtoms[element]) {
                 return false;
            }
        }
        return true;
    }

    function parseEquation(equationStr) {
        if (!equationStr.includes('<=>')) return null;

        const parts = equationStr.split('<=>');
        const reactantsStr = parts[0].trim();
        const productsStr = parts[1].trim();

        const parseSide = (sideStr) => {
            return sideStr.split('+').map(term => {
                const trimmed = term.trim();
                const match = trimmed.match(/^(\d*)\s*([A-Za-z0-9()]+)$/);
                if (match) {
                    const coeff = parseInt(match[1] || '1', 10);
                    const name = match[2];
                    return { name, coeff };
                }
                return null;
            }).filter(Boolean);
        };
        
        const reactants = parseSide(reactantsStr);
        const products = parseSide(productsStr);

        if (reactants.length === 0 || products.length === 0) return null;

        return { reactants, products };
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        clearError();
        resultContainer.classList.add('hidden');
        
        const parsed = parseEquation(equationInput.value);
        if (!parsed) {
            showError('Error: Por favor, introduce una ecuación química válida con el formato "A + B <=> C + D".');
            return;
        }

        if (!isEquationBalanced(parsed)) {
            showError('Error: La ecuación química no está balanceada. Por favor, revisa los coeficientes.');
            return;
        }

        const equilibriumSpeciesName = equilibriumSpeciesSelect.value;
        const equilibriumValue = parseFloat(equilibriumValueInput.value);

        if (!equilibriumSpeciesName || isNaN(equilibriumValue) || equilibriumValue < 0) {
            showError('Error: Por favor, selecciona una especie, y proporciona un valor de equilibrio válido y positivo para poder calcular el cambio (x).');
            return;
        }
        
        const initialValues = {};
        const allSpecies = [...parsed.reactants, ...parsed.products];
        let missingData = false;
        for(const species of allSpecies) {
            const input = document.getElementById(`initial-${species.name}`);
            const value = parseFloat(input.value);
            if(isNaN(value) || value < 0) {
                showError(`Error: Por favor, introduce un valor inicial válido y positivo para ${species.name}.`);
                missingData = true;
                break;
            }
            initialValues[species.name] = value;
        }
        if(missingData) return;
        
        
        let changeX = 0;
        let equilibriumSpeciesCoeff = 0;
        let isReactant = false;

        const eqSpecies = allSpecies.find(s => s.name === equilibriumSpeciesName);
        if (!eqSpecies) return; 

        equilibriumSpeciesCoeff = eqSpecies.coeff;
        const initialVal = initialValues[equilibriumSpeciesName];

        if (parsed.reactants.some(r => r.name === equilibriumSpeciesName)) {
            isReactant = true;
            // E = I - cx  =>  x = (I - E) / c
            changeX = (initialVal - equilibriumValue) / equilibriumSpeciesCoeff;
        } else {
            // E = I + cx  =>  x = (E - I) / c
            changeX = (equilibriumValue - initialVal) / equilibriumSpeciesCoeff;
        }

        const equilibriumValues = {};
        let invalidX = false;
        allSpecies.forEach(s => {
            const initial = initialValues[s.name];
            let finalValue;
            if (parsed.reactants.some(r => r.name === s.name)) {
                finalValue = initial - s.coeff * changeX;
            } else {
                finalValue = initial + s.coeff * changeX;
            }

           
            if (finalValue < 0 && Math.abs(finalValue) > 1e-9) { 
                showError(`Error: El valor de equilibrio ingresado para ${equilibriumSpeciesName} es imposible. Resulta en una cantidad negativa de ${s.name} (${finalValue.toFixed(4)}).`);
                invalidX = true;
            }
            equilibriumValues[s.name] = finalValue;
        });
        
        if (invalidX) return;
        
        
        let numerator = 1;
        let denominator = 1;
        parsed.products.forEach(p => numerator *= Math.pow(equilibriumValues[p.name], p.coeff));
        parsed.reactants.forEach(r => denominator *= Math.pow(equilibriumValues[r.name], r.coeff));
        
        const K = denominator === 0 ? Infinity : numerator / denominator;
        
        displayResults(parsed, initialValues, changeX, equilibriumValues, K);
    });

    function getChangeExplanation(parsed) {
        let explanation = `<p><strong>Relación Estequiométrica (El porqué del cambio "x"):</strong></p>
        <p>Según la ecuación, por cada cambio "x", las cantidades de las sustancias varían según sus coeficientes:</p><ul>`;

        parsed.reactants.forEach(r => {
            const coeff = r.coeff === 1 ? '' : r.coeff;
            explanation += `<li>Se consume <strong>${r.coeff}</strong> mol de <strong>${r.name}</strong>, por lo tanto su cambio es <strong>-${coeff}x</strong>.</li>`;
        });
        parsed.products.forEach(p => {
            const coeff = p.coeff === 1 ? '' : p.coeff;
            explanation += `<li>Se forma <strong>${p.coeff}</strong> mol de <strong>${p.name}</strong>, por lo tanto su cambio es <strong>+${coeff}x</strong>.</li>`;
        });

        explanation += '</ul>';
        return explanation;
    }

    function displayResults(parsed, initial, changeX, equilibrium, K) {
        const type = equilibriumTypeSelect.value.toUpperCase();
        const units = type === 'KC' ? 'M' : 'atm';

        
        let tableHTML = `<h4>Tabla ICE (${units})</h4><table><thead><tr><th>Especie</th><th>Inicial (${units})</th><th>Cambio (${units})</th><th>Equilibrio (${units})</th></tr></thead><tbody>`;
        const allSpecies = [...parsed.reactants, ...parsed.products];
        allSpecies.forEach(s => {
            const sign = parsed.reactants.some(r => r.name === s.name) ? '-' : '+';
            const changeStr = `${sign} ${s.coeff === 1 ? '' : s.coeff}x`;
            tableHTML += `
                <tr>
                    <td>${s.name}</td>
                    <td>${initial[s.name].toFixed(4)}</td>
                    <td>${changeStr}</td>
                    <td>${equilibrium[s.name].toFixed(4)}</td>
                </tr>
            `;
        });
        tableHTML += '</tbody></table>';
        iceTableContainer.innerHTML = tableHTML;

       
        const eqSpecies = allSpecies.find(s => s.name === equilibriumSpeciesSelect.value);
        const eqSign = parsed.reactants.some(r => r.name === eqSpecies.name) ? '-' : '+';
        const eqCoeffStr = eqSpecies.coeff === 1 ? '' : eqSpecies.coeff;

        let stepsHTML = `
            <h4>Explicación Paso a Paso</h4>
            <p><strong>1. Encontrar el cambio (x):</strong> Usamos la especie de referencia (${equilibriumSpeciesSelect.value}) cuyo valor de equilibrio es <strong>${equilibriumValueInput.value} ${units}</strong>.</p>
            <p>La relación para esta especie es: <code>[${eqSpecies.name}]_eq = [${eqSpecies.name}]_inicial ${eqSign} ${eqCoeffStr}x</code></p>
            <p>Sustituyendo los valores conocidos:<br>
            <code>${equilibriumValueInput.value} = ${initial[eqSpecies.name].toFixed(4)} ${eqSign} ${eqCoeffStr}x</code><br>
            Resolviendo esta ecuación, se determinó que <strong>x = ${changeX.toFixed(4)}</strong>.</p>
            
            ${getChangeExplanation(parsed)}

            <p><strong>2. Calcular los valores en Equilibrio:</strong> Con el valor de x, calculamos los valores de equilibrio para todas las especies.</p>
            <ul>
                ${allSpecies.map(s => `<li><strong>[${s.name}]</strong> = ${equilibrium[s.name].toFixed(4)} ${units}</li>`).join('')}
            </ul>

            <p><strong>3. Calcular ${type}:</strong> Usamos la fórmula de la constante de equilibrio y los valores finales.</p>
            <p><code>${type} = ${getKExpression(parsed)}</code></p>
            <p><code>${type} = ${getKValuesExpression(parsed, equilibrium)}</code></p>
            <p><strong>Resultado Final: ${type} ≈ ${K.toPrecision(4)}</strong></p>
        `;

        calculationStepsContainer.innerHTML = stepsHTML;
        resultContainer.classList.remove('hidden');
    }
    
    function getKExpression(parsed) {
        const num = parsed.products.map(p => `[${p.name}]${p.coeff > 1 ? `<sup>${p.coeff}</sup>` : ''}`).join('');
        const den = parsed.reactants.map(r => `[${r.name}]${r.coeff > 1 ? `<sup>${r.coeff}</sup>` : ''}`).join('');
        return `( ${num} ) / ( ${den} )`;
    }

    function getKValuesExpression(parsed, equilibrium) {
        const num = parsed.products.map(p => `${equilibrium[p.name].toFixed(4)}${p.coeff > 1 ? `<sup>${p.coeff}</sup>` : ''}`).join(' * ');
        const den = parsed.reactants.map(r => `${equilibrium[r.name].toFixed(4)}${r.coeff > 1 ? `<sup>${r.coeff}</sup>` : ''}`).join(' * ');
        return `( ${num} ) / ( ${den} )`;
    }
});