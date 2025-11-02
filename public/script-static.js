// Global variables
let dashboardData = {};
let employees = [];
let recommendations = [];
let performanceChart = null;
let departmentChart = null;
let satisfactionChart = null;
let statusChart = null;

// Load data from JSON files
async function loadData() {
    try {
        console.log('Loading data from JSON files...');
        
        const [employeesResponse, recommendationsResponse, chartsResponse] = await Promise.all([
            fetch('/data/employees.json'),
            fetch('/data/recommendations.json'),
            fetch('/data/charts.json')
        ]);

        console.log('Responses received, parsing JSON...');
        
        employees = await employeesResponse.json();
        recommendations = await recommendationsResponse.json();
        const chartData = await chartsResponse.json();
        
        console.log('Data loaded:', {
            employees: employees.length,
            recommendations: recommendations.length,
            chartData: chartData
        });
        
        // Initialize dashboard
        initializeDashboard();
        initializeCharts(chartData);
        
        showToast('Dados carregados com sucesso!', 'success');
        
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Erro ao carregar dados', 'error');
    }
}

// Initialize dashboard with data
function initializeDashboard() {
    console.log('Initializing dashboard with data...');
    
    // Calculate metrics
    const totalEmployees = employees.length;
    const atRiskEmployees = employees.filter(emp => emp.performance < 80 || emp.satisfaction < 80).length;
    const avgPerformance = Math.round(employees.reduce((sum, emp) => sum + emp.performance, 0) / totalEmployees);
    const avgSatisfaction = Math.round(employees.reduce((sum, emp) => sum + emp.satisfaction, 0) / totalEmployees);

    // Update dashboard metrics
    document.getElementById('total-employees').textContent = totalEmployees;
    document.getElementById('at-risk-employees').textContent = atRiskEmployees;
    document.getElementById('avg-performance').textContent = `${avgPerformance}%`;
    document.getElementById('avg-satisfaction').textContent = `${avgSatisfaction}%`;

    // Populate dashboard sections
    populateDashboardRecommendations();
    populateRecentEmployees();
    
    // Populate full pages
    populateEmployeeTable();
    populateRecommendations();
    
    console.log('Dashboard initialized successfully');
}

// Initialize charts with data
function initializeCharts(chartData) {
    // Performance Chart
    const perfCtx = document.getElementById('performanceChart');
    if (perfCtx) {
        performanceChart = new Chart(perfCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: chartData.performance.labels,
                datasets: [{
                    label: 'Performance Média (%)',
                    data: chartData.performance.data,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Meta (%)',
                    data: new Array(chartData.performance.labels.length).fill(85),
                    borderColor: '#e74c3c',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendência de Performance'
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 70,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Department Chart
    const deptCtx = document.getElementById('departmentChart');
    if (deptCtx) {
        departmentChart = new Chart(deptCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: chartData.departments.labels,
                datasets: [{
                    label: 'Performance por Departamento (%)',
                    data: chartData.departments.data,
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(230, 126, 34, 0.8)'
                    ],
                    borderColor: [
                        '#3498db',
                        '#2ecc71',
                        '#9b59b6',
                        '#f1c40f',
                        '#e67e22'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Performance por Departamento'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 70,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Satisfaction Chart
    const satCtx = document.getElementById('satisfactionChart');
    if (satCtx) {
        satisfactionChart = new Chart(satCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: chartData.satisfaction.labels,
                datasets: [{
                    label: 'Satisfação Média (%)',
                    data: chartData.satisfaction.data,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Meta (%)',
                    data: new Array(chartData.satisfaction.labels.length).fill(90),
                    borderColor: '#e74c3c',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Satisfação dos Funcionários'
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 70,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Status Chart
    const statusCtx = document.getElementById('statusChart');
    if (statusCtx) {
        statusChart = new Chart(statusCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: chartData.status.labels,
                datasets: [{
                    data: chartData.status.data,
                    backgroundColor: [
                        '#2ecc71',
                        '#f39c12',
                        '#e74c3c',
                        '#9b59b6'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Status dos Funcionários'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Populate employee table
function populateEmployeeTable() {
    const container = document.getElementById('employees-grid');
    if (!container) return;

    container.innerHTML = '';
    
    employees.forEach(employee => {
        const card = document.createElement('div');
        card.className = 'employee-card';
        
        const statusBadge = getStatusBadge(employee.status);
        const performanceColor = getPerformanceColor(employee.performance);
        
        card.innerHTML = `
            <div class="employee-card-header">
                <img src="${employee.avatar}" alt="${employee.name}" class="employee-card-avatar">
                <div class="employee-card-info">
                    <h3>${employee.name}</h3>
                    <p>${employee.position}</p>
                    <span class="department-tag">${employee.department}</span>
                </div>
                <span class="status-badge status-${employee.status}">${statusBadge}</span>
            </div>
            <div class="employee-metrics">
                <div class="metric">
                    <span class="metric-label">Performance</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${employee.performance}%; background-color: ${performanceColor}"></div>
                    </div>
                    <span class="metric-value">${employee.performance}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Satisfação</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${employee.satisfaction}%; background-color: #2ecc71"></div>
                    </div>
                    <span class="metric-value">${employee.satisfaction}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Produtividade</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${employee.productivity}%; background-color: #3498db"></div>
                    </div>
                    <span class="metric-value">${employee.productivity}%</span>
                </div>
            </div>
            <div class="employee-footer">
                <span class="last-activity">Última atividade: ${new Date(employee.lastActivity).toLocaleDateString('pt-BR')}</span>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Populate recommendations
function populateRecommendations() {
    const container = document.getElementById('recommendations-grid');
    if (!container) return;

    container.innerHTML = '';
    
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        
        // Add click event listener instead of onclick attribute
        card.addEventListener('click', function() {
            console.log('Recommendation card clicked:', rec.id, rec.title);
            showRecommendationDetails(rec.id);
        });
        
        // Add cursor pointer style
        card.style.cursor = 'pointer';
        
        const priorityClass = rec.priority === 'high' ? 'priority-high' : 'priority-medium';
        
        card.innerHTML = `
            <div class="recommendation-header">
                <h3>${rec.title}</h3>
                <span class="priority-badge ${priorityClass}">${rec.priority === 'high' ? 'Alta' : 'Média'}</span>
            </div>
            <p class="recommendation-description">${rec.description}</p>
            <div class="recommendation-footer">
                <span class="department-tag">${rec.department}</span>
                <span class="impact-text">${rec.impact}</span>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Populate dashboard recommendations (simplified version)
function populateDashboardRecommendations() {
    const container = document.getElementById('recommendations-list');
    if (!container) {
        console.warn('Recommendations list container not found');
        return;
    }

    container.innerHTML = '';
    
    // Show only first 3 recommendations for dashboard
    const dashboardRecs = recommendations.slice(0, 3);
    
    dashboardRecs.forEach(rec => {
        const item = document.createElement('div');
        item.className = 'recommendation-item';
        
        // Add click event listener instead of onclick attribute
        item.addEventListener('click', function() {
            console.log('Recommendation clicked:', rec.id, rec.title);
            showRecommendationDetails(rec.id);
        });
        
        // Add cursor pointer style
        item.style.cursor = 'pointer';
        
        const priorityClass = rec.priority === 'high' ? 'high' : 'medium';
        
        item.innerHTML = `
            <div class="recommendation-priority ${priorityClass}"></div>
            <div class="recommendation-content">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
                <div class="recommendation-meta">
                    <span class="department">${rec.department}</span>
                    <span class="priority-text">${rec.priority === 'high' ? 'Alta Prioridade' : 'Média Prioridade'}</span>
                </div>
            </div>
        `;
        
        container.appendChild(item);
    });
    
    console.log('Dashboard recommendations populated:', dashboardRecs.length);
}

// Populate recent employees
function populateRecentEmployees() {
    const container = document.getElementById('recent-employees');
    if (!container) {
        console.warn('Recent employees container not found');
        return;
    }

    container.innerHTML = '';
    
    // Sort employees by last activity and get the 4 most recent
    const recentEmployees = [...employees]
        .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
        .slice(0, 4);
    
    recentEmployees.forEach(employee => {
        const item = document.createElement('div');
        item.className = 'employee-item';
        
        const statusBadge = getStatusBadge(employee.status);
        const performanceColor = getPerformanceColor(employee.performance);
        
        item.innerHTML = `
            <img src="${employee.avatar}" alt="${employee.name}" class="employee-avatar">
            <div class="employee-info">
                <h4>${employee.name}</h4>
                <p>${employee.position}</p>
                <div class="employee-metrics-small">
                    <span class="performance-indicator" style="color: ${performanceColor}">
                        ${employee.performance}%
                    </span>
                    <span class="status-indicator status-${employee.status}">
                        ${statusBadge}
                    </span>
                </div>
            </div>
        `;
        
        container.appendChild(item);
    });
    
    console.log('Recent employees populated:', recentEmployees.length);
}

// Show recommendation details in modal
function showRecommendationDetails(id) {
    console.log('Opening recommendation details for ID:', id);
    
    const recommendation = recommendations.find(r => r.id === id);
    if (!recommendation) {
        console.error('Recommendation not found for ID:', id);
        return;
    }

    const modal = document.getElementById('recommendationModal');
    if (!modal) {
        console.error('Modal not found');
        return;
    }

    // Update modal content using the correct IDs from HTML
    const modalTitle = document.getElementById('modalTitle');
    const modalProblem = document.getElementById('modalProblem');
    const modalAnalysis = document.getElementById('modalAnalysis');
    const modalReason = document.getElementById('modalReason');
    const modalAction = document.getElementById('modalAction');
    const modalTimeline = document.getElementById('modalTimeline');
    const modalExpectedResult = document.getElementById('modalExpectedResult');
    const modalPriority = document.getElementById('modalPriority');

    console.log('Modal elements found:', {
        modalTitle: !!modalTitle,
        modalProblem: !!modalProblem,
        modalAnalysis: !!modalAnalysis,
        modalReason: !!modalReason,
        modalAction: !!modalAction,
        modalTimeline: !!modalTimeline,
        modalExpectedResult: !!modalExpectedResult,
        modalPriority: !!modalPriority
    });

    // Set content
    if (modalTitle) modalTitle.textContent = recommendation.title;
    if (modalProblem) modalProblem.textContent = recommendation.description;
    if (modalReason) modalReason.innerHTML = recommendation.analysis;
    if (modalAction) modalAction.textContent = `${recommendation.title} - ${recommendation.description}`;
    if (modalTimeline) modalTimeline.textContent = recommendation.timeline;
    
    // Set priority indicator
    if (modalPriority) {
        const priorityText = recommendation.priority === 'high' ? 'Alta Prioridade' : 'Média Prioridade';
        console.log('Setting priority:', priorityText, 'for class:', recommendation.priority);
        console.log('Before - modalPriority:', {
            innerHTML: modalPriority.innerHTML,
            textContent: modalPriority.textContent,
            className: modalPriority.className,
            display: window.getComputedStyle(modalPriority).display,
            visibility: window.getComputedStyle(modalPriority).visibility
        });
        
        modalPriority.textContent = priorityText;
        modalPriority.className = `priority-indicator ${recommendation.priority}`;
        
        console.log('After - modalPriority:', {
            innerHTML: modalPriority.innerHTML,
            textContent: modalPriority.textContent,
            className: modalPriority.className,
            display: window.getComputedStyle(modalPriority).display,
            visibility: window.getComputedStyle(modalPriority).visibility,
            color: window.getComputedStyle(modalPriority).color,
            background: window.getComputedStyle(modalPriority).background
        });
    } else {
        console.error('modalPriority element not found!');
    }

    // Create analysis grid with metrics
    if (modalAnalysis) {
        modalAnalysis.innerHTML = `
            <div class="analysis-item">
                <span class="analysis-label">Departamento:</span>
                <span class="analysis-value">${recommendation.department}</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Impacto:</span>
                <span class="analysis-value">${recommendation.impact}</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Prioridade:</span>
                <span class="analysis-value">${recommendation.priority === 'high' ? 'Alta' : 'Média'}</span>
            </div>
            <div class="analysis-item">
                <span class="analysis-label">Timeline:</span>
                <span class="analysis-value">${recommendation.timeline}</span>
            </div>
        `;
    }

    // Set expected results with better formatting
    if (modalExpectedResult) {
        const resultsHtml = recommendation.expectedResults
            .map(result => `<div style="margin-bottom: 8px;"><i class="fas fa-check-circle" style="color: #2ecc71; margin-right: 8px;"></i>${result}</div>`)
            .join('');
        modalExpectedResult.innerHTML = resultsHtml;
    }

    // Show modal
    modal.style.display = 'block';
    console.log('Modal opened successfully');
}

// Close modal
function closeRecommendationModal() {
    document.getElementById('recommendationModal').style.display = 'none';
}

// Utility functions
function getStatusBadge(status) {
    const statusMap = {
        'active': 'Ativo',
        'vacation': 'Férias',
        'leave': 'Licença',
        'training': 'Treinamento'
    };
    return statusMap[status] || status;
}

function getPerformanceColor(performance) {
    if (performance >= 90) return '#2ecc71';
    if (performance >= 80) return '#f39c12';
    if (performance >= 70) return '#e67e22';
    return '#e74c3c';
}

// Handle hash-based navigation
function handleHashChange() {
    const hash = window.location.hash.slice(1); // Remove the '#'
    const pageId = hash || 'dashboard';
    showPage(pageId);
}

// Navigation
function showPage(pageId) {
    console.log('Showing page:', pageId);
    
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected page
    const page = document.getElementById(pageId + '-content');
    if (page) {
        page.style.display = 'block';
        console.log('Page shown:', pageId + '-content');
    } else {
        console.warn('Page not found:', pageId + '-content');
        // Fallback to dashboard
        const dashboardPage = document.getElementById('dashboard-content');
        if (dashboardPage) {
            dashboardPage.style.display = 'block';
        }
    }
    
    // Add active class to clicked nav item
    const navItem = document.querySelector(`[href="#${pageId}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
}

// Initialize hash navigation
window.addEventListener('hashchange', handleHashChange);
window.addEventListener('load', handleHashChange);

// Copy citation function
async function copyCitation() {
    const citation = 'SILVA, Letícia et al. AI HR Agent for Proactive HR Management: Visual Interface Demo. UNIVESP, 2025.';
    
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(citation);
            showToast('Citação copiada para a área de transferência!', 'success');
        } else {
            // Fallback for insecure contexts
            const textArea = document.createElement('textarea');
            textArea.value = citation;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
            showToast('Citação copiada para a área de transferência!', 'success');
        }
    } catch (error) {
        console.error('Error copying citation:', error);
        showToast('Erro ao copiar citação', 'error');
    }
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    if (type === 'success') {
        toast.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#e74c3c';
    } else {
        toast.style.backgroundColor = '#3498db';
    }
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove toast
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting data load...');
    
    // Initialize navigation first
    handleHashChange();
    
    // Load data
    loadData();
    
    // Close modal when clicking outside or on close button
    window.onclick = function(event) {
        const modal = document.getElementById('recommendationModal');
        if (event.target === modal) {
            closeRecommendationModal();
        }
    };
    
    // Close modal when clicking close button
    const closeButton = document.getElementById('closeModal');
    if (closeButton) {
        closeButton.onclick = function() {
            closeRecommendationModal();
        };
    }
    
    // Dismiss recommendation button
    const dismissButton = document.getElementById('dismissRecommendation');
    if (dismissButton) {
        dismissButton.onclick = function() {
            closeRecommendationModal();
            showToast('Recomendação dispensada', 'info');
        };
    }
    
    // Accept recommendation button
    const acceptButton = document.getElementById('acceptRecommendation');
    if (acceptButton) {
        acceptButton.onclick = function() {
            closeRecommendationModal();
            showToast('Recomendação aceita! Implementação iniciada.', 'success');
        };
    }
});

// Make functions globally available
window.showRecommendationDetails = showRecommendationDetails;
window.closeRecommendationModal = closeRecommendationModal;
window.showPage = showPage;
window.copyCitation = copyCitation;

// Test function for debugging
window.testModal = function() {
    console.log('Testing modal with first recommendation...');
    if (recommendations.length > 0) {
        showRecommendationDetails(recommendations[0].id);
    } else {
        console.log('No recommendations loaded');
    }
};