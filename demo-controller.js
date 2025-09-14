/**
 * Demo Controller for Mozambique AI Interactive Demo
 * Handles real user flows for benefits navigation and legal aid
 */

import { LLM } from './llm-adapter.js';

class DemoController {
    constructor() {
        this.currentFlow = null;
        this.flowState = {};
        this.userProfile = {};
        this.currentLanguage = 'portuguese';
        
        this.initEventListeners();
        this.loadKnowledgeBase();
    }

    initEventListeners() {
        // Real demo buttons
        const benefitsDemo = document.getElementById('start-benefits-demo');
        const legalDemo = document.getElementById('start-legal-demo');
        
        if (benefitsDemo) {
            benefitsDemo.addEventListener('click', () => this.startBenefitsFlow());
        }
        
        if (legalDemo) {
            legalDemo.addEventListener('click', () => this.startLegalFlow());
        }

        // Language switching
        const langSwitch = document.getElementById('demo-switch-lang');
        if (langSwitch) {
            langSwitch.addEventListener('click', () => this.switchLanguage());
        }
    }

    async loadKnowledgeBase() {
        // Simulated knowledge base - in production this would be loaded from local storage
        this.knowledgeBase = {
            benefits: {
                'social_assistance': {
                    name: 'Auxílio Social Directo (PASD)',
                    eligibility: ['household_income_less_than_1000_mt', 'has_children_under_18', 'no_formal_employment'],
                    documents: ['BI (Bilhete de Identidade)', 'Declaração de rendimentos', 'Certificado de nascimento dos filhos'],
                    process: ['Dirigir-se ao posto administrativo local', 'Preencher formulário de candidatura', 'Aguardar visita domiciliária'],
                    costs: 'Gratuito',
                    processing_time: '30-60 dias'
                },
                'education_support': {
                    name: 'Apoio Escolar',
                    eligibility: ['children_in_school', 'household_income_less_than_2000_mt'],
                    documents: ['BI', 'Declaração escolar', 'Comprovativo de residência'],
                    process: ['Contactar a escola', 'Submeter documentação', 'Aguardar aprovação'],
                    costs: 'Gratuito',
                    processing_time: '15-30 dias'
                }
            },
            legal: {
                wage_disputes: {
                    safety_triggers: ['physical_violence', 'threats', 'under_18'],
                    steps: [
                        'Recolher evidências (recibos de salário, contratos)',
                        'Tentar resolução direta com empregador',
                        'Contactar sindicato ou Inspecção do Trabalho',
                        'Considerar ação judicial se necessário'
                    ],
                    forms: ['complaint_template', 'evidence_checklist'],
                    authorities: ['Inspecção do Trabalho - Maputo: +258 21 428 177', 'Tribunal do Trabalho']
                },
                land_rights: {
                    safety_triggers: ['forced_eviction', 'violence', 'minors_involved'],
                    steps: [
                        'Verificar documentação da terra (DUAT)',
                        'Contactar administração local',
                        'Procurar mediação comunitária',
                        'Consultar advogado se conflito persistir'
                    ],
                    forms: ['land_complaint_template'],
                    authorities: ['Administração Distrital', 'Tribunal Judicial']
                }
            },
            ussd: {
                vodacom: [
                    { code: '*140#', purpose: 'Verificar saldo', category: 'mobile_money' },
                    { code: '*142#', purpose: 'M-Pesa menu principal', category: 'mobile_money' }
                ],
                movitel: [
                    { code: '*130#', purpose: 'Verificar saldo', category: 'mobile_money' },
                    { code: '*131#', purpose: 'M-Kesh menu', category: 'mobile_money' }
                ]
            },
            phrases: {
                makhuwa: {
                    greetings: ['Salama', 'Mwanlepo', 'Ehanla'],
                    common: {
                        'yes': 'Eehe',
                        'no': 'Aaha',
                        'help': 'Ufuna othuna',
                        'thank_you': 'Kanimambo'
                    }
                },
                sena: {
                    greetings: ['Muli bwanji', 'Ndamuka bwino'],
                    common: {
                        'yes': 'Eya',
                        'no': 'Ayi',
                        'help': 'Chindu chithandizo',
                        'thank_you': 'Zikomo'
                    }
                }
            }
        };
    }

    async startBenefitsFlow() {
        this.currentFlow = 'benefits';
        this.flowState = { step: 'profile_collection' };
        
        await this.showDemoModal('Benefits Navigation Demo', this.renderProfileForm());
    }

    async startLegalFlow() {
        this.currentFlow = 'legal';
        this.flowState = { step: 'issue_selection' };
        
        await this.showDemoModal('Legal Aid Demo', this.renderIssueSelection());
    }

    renderProfileForm() {
        return `
            <div class="demo-step">
                <h4>📋 User Profile Collection</h4>
                <p>Please provide basic information to determine benefit eligibility:</p>
                <form id="profile-form" class="demo-form">
                    <label>
                        Household monthly income (MT):
                        <select name="income" required>
                            <option value="">Select range</option>
                            <option value="less_than_1000">Less than 1,000 MT</option>
                            <option value="1000_2000">1,000 - 2,000 MT</option>
                            <option value="2000_5000">2,000 - 5,000 MT</option>
                            <option value="more_than_5000">More than 5,000 MT</option>
                        </select>
                    </label>
                    <label>
                        Children under 18:
                        <select name="children" required>
                            <option value="">Select</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </label>
                    <label>
                        Employment status:
                        <select name="employment" required>
                            <option value="">Select</option>
                            <option value="formal">Formal employment</option>
                            <option value="informal">Informal work</option>
                            <option value="unemployed">Unemployed</option>
                        </select>
                    </label>
                    <button type="submit" class="btn btn-primary">Continue →</button>
                </form>
            </div>
        `;
    }

    renderIssueSelection() {
        return `
            <div class="demo-step">
                <h4>⚖️ Legal Issue Selection</h4>
                <p>What type of legal issue do you need help with?</p>
                <div class="issue-grid">
                    <button class="issue-card" data-issue="wage_dispute">
                        <h5>💰 Wage Dispute</h5>
                        <p>Problems with unpaid wages or labor disputes</p>
                    </button>
                    <button class="issue-card" data-issue="land_rights">
                        <h5>🏡 Land Rights</h5>
                        <p>Land ownership or boundary disputes</p>
                    </button>
                    <button class="issue-card" data-issue="documentation">
                        <h5>📄 Documentation</h5>
                        <p>Problems with ID cards, birth certificates</p>
                    </button>
                    <button class="issue-card" data-issue="family_law">
                        <h5>👨‍👩‍👧‍👦 Family Law</h5>
                        <p>Marriage, divorce, child custody issues</p>
                    </button>
                </div>
            </div>
        `;
    }

    async handleProfileSubmit(formData) {
        this.userProfile = {
            income: formData.get('income'),
            children: formData.get('children') === 'yes',
            employment: formData.get('employment')
        };

        this.flowState.step = 'eligibility_check';
        
        // Use LLM to determine eligibility
        try {
            const eligibilityPrompt = `
                Based on this user profile, determine eligibility for Mozambique government benefits:
                - Income: ${this.userProfile.income}
                - Has children under 18: ${this.userProfile.children}
                - Employment: ${this.userProfile.employment}
                
                Available benefits:
                1. Auxílio Social Directo (PASD) - for households with income < 1000 MT and children under 18
                2. Apoio Escolar - for families with children in school and income < 2000 MT
                
                Provide specific eligibility assessment and next steps in Portuguese.
            `;

            const response = await LLM.chat([
                { role: 'system', content: 'Você é um especialista em benefícios sociais em Moçambique. SEMPRE responda em português, com linguagem simples e passos práticos.' },
                { role: 'user', content: eligibilityPrompt }
            ], { max_tokens: 400, temperature: 0.1 });

            await this.showDemoModal('Benefits Eligibility Results', this.renderEligibilityResults(response.text));

        } catch (error) {
            console.error('LLM Error:', error);
            await this.showDemoModal('Benefits Eligibility Results', this.renderEligibilityResults(this.getFallbackEligibility()));
        }
    }

    async handleIssueSelection(issueType) {
        this.flowState.issue = issueType;
        this.flowState.step = 'safety_check';

        const safetyPrompt = `
            User selected legal issue: ${issueType}
            
            Perform safety screening for high-risk scenarios. Ask 2-3 screening questions to determine if this requires immediate human intervention.
            
            High-risk triggers include: violence, threats, minors at risk, forced eviction, immediate danger.
            
            If high-risk, respond with "PRECISA_CONSULTAR_ADVOGADO" and explain why.
            If safe to proceed, provide initial guidance questions.
            
            Respond in Portuguese.
        `;

        try {
            const response = await LLM.chat([
                { role: 'system', content: 'Você é um técnico jurídico (paralegal) em Moçambique. PRIORIZE a segurança do utilizador. SEMPRE responda em português.' },
                { role: 'user', content: safetyPrompt }
            ], { max_tokens: 300, temperature: 0.1 });

            if (response.text.includes('PRECISA_CONSULTAR_ADVOGADO')) {
                await this.showDemoModal('⚠️ Human Referral Required', this.renderHumanReferral(response.text));
            } else {
                await this.showDemoModal('Legal Guidance', this.renderLegalGuidance(response.text, issueType));
            }

        } catch (error) {
            console.error('LLM Error:', error);
            await this.showDemoModal('Legal Guidance', this.renderLegalGuidance(this.getFallbackLegalGuidance(issueType), issueType));
        }
    }

    renderEligibilityResults(aiResponse) {
        return `
            <div class="demo-step">
                <h4>✅ Eligibility Assessment</h4>
                <div class="ai-response">
                    ${aiResponse.replace(/\n/g, '<br>')}
                </div>
                
                <div class="demo-actions">
                    <button class="btn btn-primary" onclick="demoController.generateDocuments()">
                        📄 Generate Documents
                    </button>
                    <button class="btn btn-secondary" onclick="demoController.showUSSDCodes()">
                        📱 Show USSD Codes
                    </button>
                </div>
            </div>
        `;
    }

    renderHumanReferral(reason) {
        return `
            <div class="demo-step high-risk">
                <h4>⚠️ Human Consultation Required</h4>
                <div class="warning-box">
                    <p><strong>This situation requires immediate human assistance:</strong></p>
                    <div class="ai-response">${reason.replace(/\n/g, '<br>')}</div>
                </div>
                
                <h5>🆘 Emergency Contacts:</h5>
                <ul>
                    <li><strong>Police:</strong> 199</li>
                    <li><strong>Legal Aid:</strong> +258 21 428 177</li>
                    <li><strong>Women's Rights:</strong> Linha Verde 116</li>
                </ul>
                
                <button class="btn btn-primary" onclick="demoController.printReferralSheet()">
                    🖨️ Print Referral Sheet
                </button>
            </div>
        `;
    }

    renderLegalGuidance(aiResponse, issueType) {
        return `
            <div class="demo-step">
                <h4>⚖️ Legal Guidance: ${issueType.replace('_', ' ')}</h4>
                <div class="ai-response">
                    ${aiResponse.replace(/\n/g, '<br>')}
                </div>
                
                <div class="demo-actions">
                    <button class="btn btn-primary" onclick="demoController.generateLegalDocument('${issueType}')">
                        📄 Generate Legal Document
                    </button>
                    <button class="btn btn-secondary" onclick="demoController.showAuthorities('${issueType}')">
                        🏛️ Show Relevant Authorities
                    </button>
                    <button class="btn btn-secondary" onclick="demoController.translateToLocal()">
                        🌍 Translate Summary
                    </button>
                </div>
            </div>
        `;
    }

    async generateDocuments() {
        // Simulate document generation
        const documents = `
            <div class="demo-step">
                <h4>📄 Generated Documents</h4>
                <div class="document-list">
                    <div class="document-item">
                        <h5>✅ Eligibility Checklist</h5>
                        <p>Personal checklist based on your profile</p>
                        <button class="btn btn-sm btn-primary" onclick="demoController.previewDocument('checklist')">Preview</button>
                    </div>
                    <div class="document-item">
                        <h5>📋 Application Form</h5>
                        <p>Pre-filled PASD application form</p>
                        <button class="btn btn-sm btn-primary" onclick="demoController.previewDocument('form')">Preview</button>
                    </div>
                </div>
                
                <div class="print-options">
                    <h5>🖨️ Print Options:</h5>
                    <button class="btn btn-primary" onclick="demoController.simulatePrint()">
                        Print to Bluetooth Printer
                    </button>
                    <button class="btn btn-secondary" onclick="demoController.simulateSMS()">
                        📱 Send SMS Confirmation
                    </button>
                </div>
            </div>
        `;
        
        await this.showDemoModal('Generated Documents', documents);
    }

    async generateLegalDocument(issueType) {
        const documentPrompt = `
            Generate a legal document template for ${issueType} in Portuguese.
            Include:
            - Template letter/form with fillable fields
            - Required evidence checklist
            - Step-by-step process
            - Relevant legal citations
            - 58mm thermal printer friendly format
        `;

        try {
            const response = await LLM.chat([
                { role: 'system', content: 'Gere documentos legais para Moçambique. SEMPRE responda em português, com linguagem simples e todas as citações necessárias.' },
                { role: 'user', content: documentPrompt }
            ], { max_tokens: 600, temperature: 0.1 });

            const document = `
                <div class="demo-step">
                    <h4>📄 Legal Document Generated</h4>
                    <div class="document-preview">
                        ${response.text.replace(/\n/g, '<br>')}
                    </div>
                    
                    <div class="print-options">
                        <button class="btn btn-primary" onclick="demoController.simulatePrint()">
                            🖨️ Print Document
                        </button>
                        <button class="btn btn-secondary" onclick="demoController.simulateSMS()">
                            📱 SMS Backup
                        </button>
                    </div>
                </div>
            `;
            
            await this.showDemoModal('Legal Document', document);
        } catch (error) {
            console.error('Document generation failed:', error);
        }
    }

    async translateToLocal() {
        if (this.currentLanguage === 'portuguese') {
            this.currentLanguage = 'makhuwa';
            await this.showDemoModal('🌍 Translation Demo', `
                <div class="demo-step">
                    <h4>Local Language Translation</h4>
                    <p><strong>Portuguese → Makhuwa</strong></p>
                    <div class="translation-demo">
                        <div class="phrase-pair">
                            <span class="original">Precisa de consultar um advogado</span>
                            <span class="translation">Ufuna othuna wa mapepe</span>
                        </div>
                        <div class="phrase-pair">
                            <span class="original">Documentos necessários</span>
                            <span class="translation">Makhadi anowajiwa</span>
                        </div>
                        <div class="phrase-pair">
                            <span class="original">Muito obrigado</span>
                            <span class="translation">Kanimambo tuu</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="demoController.simulateTTS()">
                        🔊 Play TTS Audio
                    </button>
                </div>
            `);
        } else {
            this.currentLanguage = 'portuguese';
            await this.showDemoModal('🌍 Language Switched', 'Switched back to Portuguese interface.');
        }
    }

    simulatePrint() {
        this.showNotification('🖨️ Printing to Bluetooth printer...', 'success');
        setTimeout(() => {
            this.showNotification('✅ Document printed successfully!', 'success');
        }, 2000);
    }

    simulateSMS() {
        this.showNotification('📱 SMS queued for sending...', 'info');
        setTimeout(() => {
            this.showNotification('✅ SMS sent to +258 8X XXX XXXX', 'success');
        }, 1500);
    }

    simulateTTS() {
        this.showNotification('🔊 Playing Makhuwa TTS...', 'info');
        // Simulate audio playback
        setTimeout(() => {
            this.showNotification('🔇 TTS playback complete', 'success');
        }, 3000);
    }

    getFallbackEligibility() {
        const { income, children, employment } = this.userProfile;
        
        if (income === 'less_than_1000' && children) {
            return `
                ✅ ELEGÍVEL para Auxílio Social Directo (PASD)
                
                Baseado no seu perfil:
                - Rendimento familiar abaixo de 1,000 MT ✅
                - Tem crianças menores de 18 anos ✅
                
                Próximos passos:
                1. Recolher documentos necessários
                2. Dirigir-se ao posto administrativo local
                3. Preencher formulário de candidatura
                
                Documentos necessários:
                - BI (Bilhete de Identidade)
                - Declaração de rendimentos
                - Certificado de nascimento dos filhos
                
                Tempo de processamento: 30-60 dias
                Custo: Gratuito
            `;
        } else {
            return `
                ❌ NÃO ELEGÍVEL para PASD
                
                Pode considerar:
                - Apoio Escolar (se tem filhos na escola)
                - Programas de formação profissional
                - Microcrédito para pequenos negócios
            `;
        }
    }

    getFallbackLegalGuidance(issueType) {
        const guidance = this.knowledgeBase.legal[issueType];
        if (!guidance) return 'Informação não disponível offline.';
        
        return `
            Orientação para ${issueType}:
            
            Passos recomendados:
            ${guidance.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
            
            Contactos úteis:
            ${guidance.authorities.join('\n')}
            
            IMPORTANTE: Se houver violência ou ameaças, contacte imediatamente a polícia (199).
        `;
    }

    switchLanguage() {
        const current = document.getElementById('langToggleBtn').textContent;
        const newLang = current === 'EN' ? 'PT' : 'EN';
        
        // Trigger the main language switch
        document.getElementById('langToggleBtn').click();
        
        this.showNotification(`🌍 Interface switched to ${newLang === 'EN' ? 'English' : 'Portuguese'}`, 'info');
    }

    async showDemoModal(title, content) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('demo-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'demo-modal';
            modal.className = 'modal-overlay';
            modal.setAttribute('aria-hidden', 'true');
            modal.innerHTML = `
                <div class="modal-panel">
                    <div class="modal-head">
                        <h3 id="demo-modal-title">${title}</h3>
                        <button class="btn btn-secondary" onclick="demoController.closeModal()">Close</button>
                    </div>
                    <div id="demo-modal-content">${content}</div>
                </div>
            `;
            document.body.appendChild(modal);
        } else {
            document.getElementById('demo-modal-title').textContent = title;
            document.getElementById('demo-modal-content').innerHTML = content;
        }

        modal.setAttribute('aria-hidden', 'false');
        this.attachFormListeners();
    }

    closeModal() {
        const modal = document.getElementById('demo-modal');
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    attachFormListeners() {
        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileSubmit(new FormData(e.target));
            });
        }

        // Issue selection
        document.querySelectorAll('.issue-card').forEach(card => {
            card.addEventListener('click', () => {
                this.handleIssueSelection(card.dataset.issue);
            });
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border: 1px solid var(--border-subtle);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Export for global access
window.demoController = new DemoController();
export { DemoController };
