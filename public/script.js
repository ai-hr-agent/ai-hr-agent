// Global variables
let dashboardData = {};
let employees = [];
let recommendations = [];
let performanceChart = null;
let departmentChart = null;
let satisfactionChart = null;
let statusChart = null;

// Mock chart data
const chartData = {
    performance: {
        '6months': {
            labels: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'],
            datasets: [{
                label: 'Performance Média (%)',
                data: [82, 84, 83, 85, 84, 85],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Meta (%)',
                data: [85, 85, 85, 85, 85, 85],
                borderColor: '#e74c3c',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0
            }]
        },
        'year': {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [{
                label: 'Performance Média (%)',
                data: [78, 79, 81, 83, 82, 82, 84, 83, 85, 84, 85, 86],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Meta (%)',
                data: [85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85],
                borderColor: '#e74c3c',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0
            }]
        },
        'quarter': {
            labels: ['Set', 'Out', 'Nov'],
            datasets: [{
                label: 'Performance Média (%)',
                data: [85, 84, 85],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Meta (%)',
                data: [85, 85, 85],
                borderColor: '#e74c3c',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0
            }]
        }
    },
    departments: {
        labels: ['Tecnologia', 'Gestão', 'Design', 'Analytics', 'Marketing', 'Vendas'],
        performance: [88, 92, 85, 79, 84, 87],
        satisfaction: [90, 85, 92, 68, 89, 91]
    },
    satisfaction: {
        labels: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'],
        datasets: [{
            label: 'Performance (%)',
            data: [82, 84, 83, 85, 84, 85],
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            yAxisID: 'y'
        }, {
            label: 'Satisfação (%)',
            data: [88, 87, 89, 86, 86, 88],
            borderColor: '#27ae60',
            backgroundColor: 'rgba(39, 174, 96, 0.1)',
            yAxisID: 'y'
        }]
    },
    status: {
        labels: ['Ativos', 'Em Risco', 'Novos Funcionários', 'Em Treinamento'],
        data: [142, 8, 12, 18],
        backgroundColor: ['#27ae60', '#e74c3c', '#3498db', '#f39c12']
    }
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupNavigation();
    loadDashboardData();
    setupModalEventListeners();
    
    // Initialize search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            searchEmployees(query);
        });
    }
});

// Initialize the application
function initializeApp() {
    console.log('AI HR Agent Demo initialized');
}

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the page to show
            const page = this.getAttribute('href').substring(1);
            showPage(page);
        });
    });
}

// Show specific page
function showPage(page) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const selectedPage = document.getElementById(`${page}-content`);
    if (selectedPage) {
        selectedPage.classList.add('active');
        
        // Update page title
        const pageTitle = document.getElementById('page-title');
        pageTitle.textContent = getPageTitle(page);
        
        // Load page-specific data
        loadPageData(page);
    }
}

// Get page title
function getPageTitle(page) {
    const titles = {
        'dashboard': 'Dashboard',
        'employees': 'Funcionários',
        'recommendations': 'Recomendações',
        'analytics': 'Analytics',
        'settings': 'Configurações',
        'about': 'Sobre'
    };
    return titles[page] || 'Dashboard';
}

// Load page-specific data
function loadPageData(page) {
    switch(page) {
        case 'employees':
            loadEmployeesPage();
            break;
        case 'recommendations':
            loadRecommendationsPage();
            break;
        case 'analytics':
            loadAnalyticsPage();
            // Initialize charts after a small delay to ensure DOM is ready
            setTimeout(() => {
                initializeAllAnalyticsCharts();
            }, 100);
            break;
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch('/api/dashboard');
        dashboardData = await response.json();
        
        updateDashboardMetrics();
        renderRecommendations(dashboardData.recommendations);
        renderRecentEmployees(dashboardData.employees);
        initializePerformanceChart();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showErrorMessage('Erro ao carregar dados do dashboard');
    }
}

// Update dashboard metrics
function updateDashboardMetrics() {
    const metrics = dashboardData.metrics;
    
    document.getElementById('total-employees').textContent = metrics.totalEmployees;
    document.getElementById('avg-performance').textContent = `${metrics.averagePerformance}%`;
    document.getElementById('avg-satisfaction').textContent = `${metrics.averageSatisfaction}%`;
    document.getElementById('at-risk-employees').textContent = metrics.atRiskEmployees;
}

// Render recommendations
function renderRecommendations(recommendationsData) {
    const container = document.getElementById('recommendations-list');
    
    if (!recommendationsData || recommendationsData.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhuma recomendação disponível</p>';
        return;
    }
    
    container.innerHTML = recommendationsData.map(rec => `
        <div class="recommendation-item" onclick="window.openRecommendationModal(${rec.id})" style="cursor: pointer;">
            <div class="recommendation-priority ${rec.priority}"></div>
            <div class="recommendation-content">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
                <span class="recommendation-action">${rec.action}</span>
            </div>
        </div>
    `).join('');
}

// Render recent employees
function renderRecentEmployees(employeesData) {
    const container = document.getElementById('recent-employees');
    
    if (!employeesData || employeesData.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhum funcionário encontrado</p>';
        return;
    }
    
    container.innerHTML = employeesData.map(emp => `
        <div class="employee-item">
            <img src="${emp.avatar}" alt="${emp.name}" class="employee-avatar" 
                 onerror="this.style.display='none'">
            <div class="employee-info">
                <h4>${emp.name}</h4>
                <p>${emp.position} - ${emp.department}</p>
            </div>
            <span class="employee-status ${emp.status}">${getStatusText(emp.status)}</span>
        </div>
    `).join('');
}

// Load employees page
async function loadEmployeesPage() {
    try {
        const response = await fetch('/api/employees');
        employees = await response.json();
        renderEmployeesGrid(employees);
        setupEmployeeFilters();
    } catch (error) {
        console.error('Error loading employees:', error);
        showErrorMessage('Erro ao carregar funcionários');
    }
}

// Render employees grid
function renderEmployeesGrid(employeesData) {
    const container = document.getElementById('employees-grid');
    
    if (!employeesData || employeesData.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhum funcionário encontrado</p>';
        return;
    }
    
    container.innerHTML = employeesData.map(emp => `
        <div class="employee-card">
            <div class="employee-card-header">
                <img src="${emp.avatar}" alt="${emp.name}" class="employee-card-avatar"
                     onerror="this.style.display='none'">
                <div class="employee-card-info">
                    <h3>${emp.name}</h3>
                    <p>${emp.position}</p>
                    <p class="department">${emp.department}</p>
                </div>
            </div>
            <div class="employee-metrics">
                <div class="metric">
                    <div class="metric-value">${emp.performance}%</div>
                    <div class="metric-label">Performance</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${emp.satisfaction}%</div>
                    <div class="metric-label">Satisfação</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${emp.productivity}%</div>
                    <div class="metric-label">Produtividade</div>
                </div>
            </div>
            <div class="employee-status-card">
                <span class="employee-status ${emp.status}">${getStatusText(emp.status)}</span>
            </div>
        </div>
    `).join('');
}

// Setup employee filters
function setupEmployeeFilters() {
    const departmentFilter = document.getElementById('department-filter');
    const statusFilter = document.getElementById('status-filter');
    
    if (departmentFilter) {
        departmentFilter.addEventListener('change', filterEmployees);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterEmployees);
    }
}

// Filter employees
function filterEmployees() {
    const departmentFilter = document.getElementById('department-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    let filteredEmployees = employees;
    
    if (departmentFilter) {
        filteredEmployees = filteredEmployees.filter(emp => emp.department === departmentFilter);
    }
    
    if (statusFilter) {
        filteredEmployees = filteredEmployees.filter(emp => emp.status === statusFilter);
    }
    
    renderEmployeesGrid(filteredEmployees);
}

// Load recommendations page
async function loadRecommendationsPage() {
    try {
        const response = await fetch('/api/recommendations');
        recommendations = await response.json();
        renderRecommendationsGrid(recommendations);
        setupRecommendationFilters();
    } catch (error) {
        console.error('Error loading recommendations:', error);
        showErrorMessage('Erro ao carregar recomendações');
    }
}

// Render recommendations grid
function renderRecommendationsGrid(recommendationsData) {
    const container = document.getElementById('recommendations-grid');
    
    if (!recommendationsData || recommendationsData.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhuma recomendação disponível</p>';
        return;
    }
    
    container.innerHTML = recommendationsData.map(rec => `
        <div class="recommendation-card ${rec.priority}" onclick="window.openRecommendationModal(${rec.id})" style="cursor: pointer;">
            <div class="recommendation-card-header">
                <h3>${rec.title}</h3>
                <span class="priority-badge ${rec.priority}">${getPriorityText(rec.priority)}</span>
            </div>
            <p>${rec.description}</p>
            <div class="recommendation-card-action">${rec.action}</div>
        </div>
    `).join('');
}

// Setup recommendation filters
function setupRecommendationFilters() {
    const priorityFilter = document.getElementById('priority-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (priorityFilter) {
        priorityFilter.addEventListener('change', filterRecommendations);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', filterRecommendations);
    }
}

// Filter recommendations
function filterRecommendations() {
    const priorityFilter = document.getElementById('priority-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    
    let filteredRecommendations = recommendations;
    
    if (priorityFilter) {
        filteredRecommendations = filteredRecommendations.filter(rec => rec.priority === priorityFilter);
    }
    
    if (typeFilter) {
        filteredRecommendations = filteredRecommendations.filter(rec => rec.type === typeFilter);
    }
    
    renderRecommendationsGrid(filteredRecommendations);
}

// Load analytics page
async function loadAnalyticsPage() {
    try {
        const response = await fetch('/api/metrics');
        const metrics = await response.json();
        updateAnalyticsMetrics(metrics);
    } catch (error) {
        console.error('Error loading analytics:', error);
        showErrorMessage('Erro ao carregar analytics');
    }
}

// Update analytics metrics
function updateAnalyticsMetrics(metrics) {
    document.getElementById('turnover-rate').textContent = `${metrics.turnoverRate}%`;
    document.getElementById('engagement-score').textContent = metrics.engagementScore;
    document.getElementById('avg-productivity').textContent = `${metrics.averageProductivity}%`;
}

// Utility functions
function getStatusText(status) {
    const statusTexts = {
        'active': 'Ativo',
        'at-risk': 'Em Risco',
        'inactive': 'Inativo'
    };
    return statusTexts[status] || status;
}

function getPriorityText(priority) {
    const priorityTexts = {
        'high': 'Alta',
        'medium': 'Média',
        'low': 'Baixa'
    };
    return priorityTexts[priority] || priority;
}

function showErrorMessage(message) {
    console.error(message);
    // You could implement a toast notification system here
    alert(message);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function initializeAllAnalyticsCharts() {
    initializeDepartmentChart();
    initializeSatisfactionChart();
    initializeStatusChart();
}

function searchEmployees(query) {
    if (!query) {
        renderEmployeesGrid(employees);
        return;
    }
    
    const filteredEmployees = employees.filter(emp => 
        emp.name.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query)
    );
    
    renderEmployeesGrid(filteredEmployees);
}

// Chart Functions
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: chartData.performance['6months'],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
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
    
    // Setup period selector
    const periodSelector = document.getElementById('chart-period');
    if (periodSelector) {
        periodSelector.addEventListener('change', function() {
            updatePerformanceChart(this.value);
        });
    }
}

function updatePerformanceChart(period) {
    if (performanceChart && chartData.performance[period]) {
        performanceChart.data = chartData.performance[period];
        performanceChart.update();
    }
}

function initializeDepartmentChart() {
    const ctx = document.getElementById('departmentChart');
    if (!ctx) return;
    
    departmentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.departments.labels,
            datasets: [{
                label: 'Performance (%)',
                data: chartData.departments.performance,
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 1
            }, {
                label: 'Satisfação (%)',
                data: chartData.departments.satisfaction,
                backgroundColor: '#27ae60',
                borderColor: '#229954',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
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

function initializeSatisfactionChart() {
    const ctx = document.getElementById('satisfactionChart');
    if (!ctx) return;
    
    satisfactionChart = new Chart(ctx, {
        type: 'line',
        data: chartData.satisfaction,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
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

function initializeStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartData.status.labels,
            datasets: [{
                data: chartData.status.data,
                backgroundColor: chartData.status.backgroundColor,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

function initializeAllAnalyticsCharts() {
    initializeDepartmentChart();
    initializeSatisfactionChart();
    initializeStatusChart();
}

// Make function globally accessible
window.openRecommendationModal = openRecommendationModal;

// Modal Functions
async function openRecommendationModal(recommendationId) {
    try {
        console.log('Opening modal for recommendation:', recommendationId);
        const response = await fetch(`/api/recommendations/${recommendationId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Recommendation data:', data);
        
        populateModal(data);
        
        const modal = document.getElementById('recommendationModal');
        if (modal) {
            modal.style.display = 'block';
        } else {
            console.error('Modal element not found');
        }
    } catch (error) {
        console.error('Error loading recommendation details:', error);
        showErrorMessage('Erro ao carregar detalhes da recomendação: ' + error.message);
    }
}

function populateModal(data) {
    console.log('Populating modal with data:', data);
    
    // Header
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.textContent = data.title || 'Recomendação';
    }
    
    // Priority indicator
    const priorityElement = document.getElementById('modalPriority');
    if (priorityElement) {
        priorityElement.className = `priority-indicator ${data.priority || 'medium'}`;
    }
    
    // Employee info
    if (data.employee) {
        const avatar = document.getElementById('modalEmployeeAvatar');
        const name = document.getElementById('modalEmployeeName');
        const position = document.getElementById('modalEmployeePosition');
        
        if (avatar) {
            avatar.src = data.employee.avatar || '';
            avatar.onerror = function() { 
                this.style.display = 'none'; 
            };
        }
        
        if (name) {
            name.textContent = data.employee.name || '';
        }
        
        if (position) {
            position.textContent = `${data.employee.position || ''} - ${data.employee.department || ''}`;
        }
    }
    
    // Problem
    const problemElement = document.getElementById('modalProblem');
    if (problemElement) {
        problemElement.textContent = data.problem || 'Problema não especificado';
    }
    
    // Analysis
    const analysisContainer = document.getElementById('modalAnalysis');
    if (analysisContainer) {
        if (data.analysis && data.analysis.length > 0) {
            analysisContainer.innerHTML = data.analysis.map(item => `
                <div class="analysis-item ${item.type || 'neutral'}">
                    <div class="analysis-value">${item.value || 'N/A'}</div>
                    <div class="analysis-label">${item.label || ''}</div>
                </div>
            `).join('');
        } else {
            analysisContainer.innerHTML = '<p>Dados de análise não disponíveis</p>';
        }
    }
    
    // Reason
    const reasonElement = document.getElementById('modalReason');
    if (reasonElement) {
        reasonElement.textContent = data.reason || 'Razão não especificada';
    }
    
    // Action
    const actionElement = document.getElementById('modalAction');
    const timelineElement = document.getElementById('modalTimeline');
    
    if (actionElement) {
        actionElement.textContent = data.action || 'Ação não especificada';
    }
    
    if (timelineElement) {
        timelineElement.textContent = data.timeline || 'Não especificado';
    }
    
    // Expected result
    const expectedResultElement = document.getElementById('modalExpectedResult');
    if (expectedResultElement) {
        expectedResultElement.textContent = data.expectedResult || 'Resultado não especificado';
    }
}

function closeModal() {
    const modal = document.getElementById('recommendationModal');
    if (modal) {
        modal.style.display = 'none';
        console.log('Modal closed');
    } else {
        console.error('Modal element not found when trying to close');
    }
}

function setupModalEventListeners() {
    console.log('Setting up modal event listeners');
    
    // Close button
    const closeButton = document.getElementById('closeModal');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    } else {
        console.error('Close button not found');
    }
    
    // Click outside modal to close
    const modal = document.getElementById('recommendationModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    } else {
        console.error('Modal element not found');
    }
    
    // Dismiss button
    const dismissButton = document.getElementById('dismissRecommendation');
    if (dismissButton) {
        dismissButton.addEventListener('click', function() {
            showSuccessMessage('Recomendação dispensada');
            closeModal();
        });
    } else {
        console.error('Dismiss button not found');
    }
    
    // Accept button
    const acceptButton = document.getElementById('acceptRecommendation');
    if (acceptButton) {
        acceptButton.addEventListener('click', function() {
            showSuccessMessage('Recomendação aceita! Ação será agendada.');
            closeModal();
        });
    } else {
        console.error('Accept button not found');
    }
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('recommendationModal');
            if (modal && modal.style.display === 'block') {
                closeModal();
            }
        }
    });
}

function showErrorMessage(message) {
    console.error(message);
    // Create a simple toast notification instead of alert
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 5000);
}

function showSuccessMessage(message) {
    console.log(message);
    // Create a simple toast notification instead of alert
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

// Copy citation function
function copyCitation() {
    const citation = "ANDRADE, Letícia Goes de; MAIA, Alex; KUWABARA, Luiz Carlos Tadashi; SANTOS, Lucas Gabriel Gallo dos. Agente de IA para Gestão Proativa de RH. 00f. Relatório Técnico-Científico. Tecnologia da Informação, Ciência de Dados e Engenharia da Computação – Universidade Virtual do Estado de São Paulo. Tutor: Isabella Caroline Martins. Polo Poá, São Caetano do Sul e Guarulhos, 2025.";
    
    navigator.clipboard.writeText(citation).then(() => {
        showSuccessMessage('Citação copiada para a área de transferência!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = citation;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showSuccessMessage('Citação copiada para a área de transferência!');
    });
}

// Make copyCitation function globally accessible
window.copyCitation = copyCitation;