import { Level } from './types';

export const LEVEL_DATA: Record<'go' | 'python', Level[]> = {
  go: [
    {
      id: 1,
      title: "Variables, Control Flow, and File I/O",
      concept: "Direct file manipulation, error handling, string parsing, and basic data structures.",
      project: "Command-Line Inventory CSV Manager",
      code: `package main

import (
	"encoding/csv"
	"fmt"
	"os"
)

type Item struct {
	ID   string
	Name string
	Qty  string
}

func main() {
	file, err := os.OpenFile("inventory.csv", os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		fmt.Printf("Fatal error opening file: %v\\n", err)
		return
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	headers := []string{"id", "name", "quantity"}
	if err := writer.Write(headers); err != nil {
		fmt.Printf("Error writing headers: %v\\n", err)
		return
	}

	items := []Item{
		{"101", "Developer Keyboard", "45"},
		{"102", "Ergonomic Office Mouse", "120"},
		{"103", "4K Type-C Monitor", "15"},
	}

	for _, item := range items {
		row := []string{item.ID, item.Name, item.Qty}
		if err := writer.Write(row); err != nil {
			fmt.Printf("Failed to write item %s: %v\\n", item.ID, err)
			continue
		}
	}
	fmt.Println("Successfully wrote database records to CSV.")
}`,
      description: "Learn Go basics: variables, structs, loops, file handling, and explicit error handling with standard 'os' and 'encoding/csv' packages.",
      estimatedWpmGoal: 22
    },
    {
      id: 2,
      title: "Structs, Methods, and Pointers",
      concept: "Memory management with pointers, custom types, and simulating OOP encapsulation.",
      project: "Double-Entry Banking Ledger System",
      code: `package main

import (
	"errors"
	"fmt"
)

type Transaction struct {
	Type   string
	Amount float64
}

type Account struct {
	Owner   string
	Balance float64
	Ledger  []Transaction
}

func NewAccount(owner string, initial float64) *Account {
	return &Account{
		Owner:   owner,
		Balance: initial,
		Ledger:  make([]Transaction, 0),
	}
}

func (a *Account) Deposit(amount float64) {
	if amount <= 0 {
		return
	}
	a.Balance += amount
	a.Ledger = append(a.Ledger, Transaction{"DEPOSIT", amount})
}

func (a *Account) Withdraw(amount float64) error {
	if amount <= 0 {
		return errors.New("amount must be positive")
	}
	if a.Balance < amount {
		return errors.New("insufficient balance for transaction")
	}
	a.Balance -= amount
	a.Ledger = append(a.Ledger, Transaction{"WITHDRAW", amount})
	return nil
}

func main() {
	acc := NewAccount("John Doe", 500.00)
	acc.Deposit(150.50)
	if err := acc.Withdraw(100.00); err != nil {
		fmt.Println("Transaction Failed:", err)
	}
	fmt.Printf("Account: %s, Net Balance: $%.2f\\n", acc.Owner, acc.Balance)
}`,
      description: "Understand Go's type model, pointer vs. value receivers, constructor patterns, and explicit state validation.",
      estimatedWpmGoal: 28
    },
    {
      id: 3,
      title: "Interfaces and Polymorphism",
      concept: "Decoupling system logic using interfaces, enabling flexible, pluggable notification engines.",
      project: "Polymorphic Notification Dispatcher",
      code: `package main

import "fmt"

type Message struct {
	Recipient string
	Body      string
}

type Provider interface {
	Send(msg Message) error
	Name() string
}

type SMSProvider struct {
	GatewayURL string
}

func (s *SMSProvider) Name() string { return "TwilioSMS" }
func (s *SMSProvider) Send(msg Message) error {
	fmt.Printf("[%s] Sending SMS to %s: %s\\n", s.Name(), msg.Recipient, msg.Body)
	return nil
}

type EmailProvider struct {
	SMTPServer string
}

func (e *EmailProvider) Name() string { return "SendGridEmail" }
func (e *EmailProvider) Send(msg Message) error {
	fmt.Printf("[%s] Sending Email to %s: %s\\n", e.Name(), msg.Recipient, msg.Body)
	return nil
}

type Dispatcher struct {
	providers []Provider
}

func (d *Dispatcher) Broadcast(msg Message) {
	for _, provider := range d.providers {
		err := provider.Send(msg)
		if err != nil {
			fmt.Printf("Failed to dispatch via %s: %v\\n", provider.Name(), err)
		}
	}
}

func main() {
	sms := &SMSProvider{GatewayURL: "https://api.sms.com"}
	email := &EmailProvider{SMTPServer: "smtp.sendgrid.net"}
	
	dispatcher := &Dispatcher{providers: []Provider{sms, email}}
	msg := Message{Recipient: "+15550199", Body: "Security alert: code verified"}
	dispatcher.Broadcast(msg)
}`,
      description: "Learn how interfaces define behavior implicitly. Master decoupled code structures, composite struct aggregation, and dynamic dispatch loops.",
      estimatedWpmGoal: 34
    },
    {
      id: 4,
      title: "Concurrency: Goroutines and Channels",
      concept: "Spawning parallel processes, distributing load, and assembling structured outputs safely.",
      project: "Concurrently Crawling Web URL Health Tracker",
      code: `package main

import (
	"fmt"
	"net/http"
	"time"
)

type CheckResult struct {
	URL     string
	Latency time.Duration
	Online  bool
}

func checkPort(url string, ch chan<- CheckResult) {
	start := time.Now()
	client := http.Client{Timeout: 3 * time.Second}
	resp, err := client.Get(url)
	
	latency := time.Since(start)
	if err != nil || resp.StatusCode != http.StatusOK {
		ch <- CheckResult{URL: url, Latency: latency, Online: false}
		return
	}
	defer resp.Body.Close()
	ch <- CheckResult{URL: url, Latency: latency, Online: true}
}

func main() {
	urls := []string{
		"https://google.com",
		"https://github.com",
		"https://go.dev",
	}

	ch := make(chan CheckResult, len(urls))
	for _, url := range urls {
		go checkPort(url, ch)
	}

	for i := 0; i < len(urls); i++ {
		res := <-ch
		fmt.Printf("Target: %s | Active: %t | Ping: %v\\n", res.URL, res.Online, res.Latency)
	}
}`,
      description: "Master Go's core concurrency primitives. Learn channels, spawning goroutines, handling timeouts, and reading channel values.",
      estimatedWpmGoal: 40
    },
    {
      id: 5,
      title: "Advanced Concurrency: Worker Pools and Sync",
      concept: "Limiting shared thread counts via Worker Pools, managing state using Mutex controls.",
      project: "Thread-Bounded CPU Worker Pool Pipeline",
      code: `package main

import (
	"fmt"
	"sync"
	"time"
)

type Job struct {
	ID    int
	Value string
}

type Result struct {
	JobID  int
	Output string
}

func worker(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
	defer wg.Done()
	for job := range jobs {
		fmt.Printf("Worker %d starting processing job %d\\n", id, job.ID)
		time.Sleep(100 * time.Millisecond) // Simulate CPU work
		results <- Result{
			JobID:  job.ID,
			Output: fmt.Sprintf("Job %d processed with value: %s", job.ID, job.Value),
		}
	}
}

func main() {
	const numWorkers = 3
	const numJobs = 5

	jobs := make(chan Job, numJobs)
	results := make(chan Result, numJobs)

	var wg sync.WaitGroup
	for w := 1; w <= numWorkers; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	for j := 1; j <= numJobs; j++ {
		jobs <- Job{ID: j, Value: fmt.Sprintf("payload_%d", j)}
	}
	close(jobs)

	wg.Wait()
	close(results)

	for res := range results {
		fmt.Println("Pool Result Received:", res.Output)
	}
}`,
      description: "Dive deep into worker pools, waitgroups, channel closing strategies, and dynamic concurrency coordination patterns.",
      estimatedWpmGoal: 46
    },
    {
      id: 6,
      title: "Native HTTP Router and JSON REST API",
      concept: "Writing native REST handlers, manipulating JSON bodies, utilizing correct HTTP status flags.",
      project: "Framework-Free Task REST API Server",
      code: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
)

type Task struct {
	ID    string
	Title string
	Done  bool
}

type Server struct {
	mu    sync.Mutex
	tasks map[string]Task
}

func (s *Server) handleTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	s.mu.Lock()
	defer s.mu.Unlock()

	switch r.Method {
	case http.MethodGet:
		taskList := make([]Task, 0, len(s.tasks))
		for _, task := range s.tasks {
			taskList = append(taskList, task)
		}
		json.NewEncoder(w).Encode(taskList)
	case http.MethodPost:
		var t Task
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		s.tasks[t.ID] = t
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(t)
	default:
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func main() {
	srv := &Server{
		tasks: make(map[string]Task),
	}
	http.HandleFunc("/tasks", srv.handleTasks)
	fmt.Println("REST server booted on port :8080")
	// http.ListenAndServe(":8080", nil) // In production
}`,
      description: "Build an enterprise REST server with the standard Go 'net/http' library. Manipulate structs in memory safely with Mutex locks and handle JSON coding.",
      estimatedWpmGoal: 52
    },
    {
      id: 7,
      title: "Middleware, Context, and Graceful Shutdown",
      concept: "Intercepting web lifecycles, passing transaction trace IDs using Context primitives.",
      project: "Production-Grade Request Tracker Wrapper",
      code: `package main

import (
	"context"
	"fmt"
	"net/http"
	"time"
)

type contextKey string
const requestIDKey contextKey = "requestID"

func withLoggingAndContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		traceID := fmt.Sprintf("tx_%d", start.UnixNano())
		
		ctx := context.WithValue(r.Context(), requestIDKey, traceID)
		
		fmt.Printf("[AUDIT] Incoming Route: %s %s | TxID: %s\\n", r.Method, r.URL.Path, traceID)
		next.ServeHTTP(w, r.WithContext(ctx))
		
		fmt.Printf("[AUDIT] Completed Route in %v | TxID: %s\\n", time.Since(start), traceID)
	})
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	txID, ok := ctx.Value(requestIDKey).(string)
	if !ok {
		txID = "unknown"
	}
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Response processed under Audit Transaction ID: %s", txID)
}

func main() {
	mux := http.NewServeMux()
	mux.Handle("/", withLoggingAndContext(http.HandlerFunc(homeHandler)))
	fmt.Println("Server started on port :3000")
}`,
      description: "Learn Go middleware composition, request decoration, context-based value passing, audit trails, and logging architectures.",
      estimatedWpmGoal: 58
    },
    {
      id: 8,
      title: "Unit Testing and Table-Driven Tests",
      concept: "Writing structured testing functions, checking negative inputs, isolating code using test doubles.",
      project: "E-Commerce Discount Engine & Table Test Suite",
      code: `package main

import (
	"errors"
	"testing"
)

func ApplyCoupon(subtotal float64, code string) (float64, error) {
	if subtotal < 0 {
		return 0, errors.New("negative total is invalid")
	}
	switch code {
	case "WELCOME10":
		return subtotal * 0.90, nil
	case "SUPER50":
		if subtotal < 100.0 {
			return subtotal, errors.New("coupon requires $100 min spend")
		}
		return subtotal * 0.50, nil
	case "":
		return subtotal, nil
	default:
		return subtotal, errors.New("unknown discount coupon code")
	}
}

func TestApplyCouponTable(t *testing.T) {
	tests := []struct {
		name      string
		subtotal  float64
		code      string
		wantTotal float64
		wantErr   bool
	}{
		{"Valid Welcome Discount", 100.0, "WELCOME10", 90.0, false},
		{"Super Promo Successful", 150.0, "SUPER50", 75.0, false},
		{"Super Promo Under Limit", 80.0, "SUPER50", 80.0, true},
		{"No Discount Code Entered", 50.0, "", 50.0, false},
		{"Negative Checkout Value", -20.0, "WELCOME10", 0, true},
	}

	for _, tt := range tests {
		got, err := ApplyCoupon(tt.subtotal, tt.code)
		if (err != nil) != tt.wantErr {
			t.Errorf("%s failed: unexpected error state", tt.name)
		}
		if got != tt.wantTotal && !tt.wantErr {
			t.Errorf("%s: got %f, want %f", tt.name, got, tt.wantTotal)
		}
	}
}`,
      description: "Learn how Go tests are engineered. Understand Go testing naming conventions, table-driven test arrays, and asserting error conditions.",
      estimatedWpmGoal: 64
    },
    {
      id: 9,
      title: "Database Interaction using SQL Mocking Patterns",
      concept: "Structuring database persistence queries, safely parsing scan models, wrapping transactional scopes.",
      project: "Transaction Database Repository Pattern",
      code: `package main

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type User struct {
	ID        int64
	Email     string
	CreatedAt time.Time
}

type UserRepository struct {
	db *sql.DB
}

func (r *UserRepository) CreateUser(ctx context.Context, email string) (*User, error) {
	query := "INSERT INTO users (email, created_at) VALUES ($1, $2) RETURNING id, email, created_at"
	
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	var u User
	err := r.db.QueryRowContext(ctx, query, email, time.Now()).Scan(&u.ID, &u.Email, &u.CreatedAt)
	if err != nil {
		return nil, errors.New("failed to execute query insert transaction")
	}
	return &u, nil
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*User, error) {
	query := "SELECT id, email, created_at FROM users WHERE email = $1"
	
	var u User
	err := r.db.QueryRowContext(ctx, query, email).Scan(&u.ID, &u.Email, &u.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}
	return &u, nil
}`,
      description: "Understand SQL querying in Go. Learn about sql.DB connection pooling, transaction bounds, resource scanning, and managing Context limits.",
      estimatedWpmGoal: 70
    },
    {
      id: 10,
      title: "Hexagonal Design Pattern Architecture",
      concept: "Separating business rules from infrastructure details (HTTP, Databases) using Ports and Adapters.",
      project: "Fully Decoupled Domain Service",
      code: `package main

import "errors"

// Domain Logic (Core)
type Order struct {
	ID    string
	Total float64
}

// Port (Inbound Primary Interface)
type OrderService interface {
	PlaceOrder(order Order) error
}

// Port (Outbound Secondary Interface)
type OrderRepository interface {
	Save(order Order) error
}

// Core Core Service Implementation
type OrderUseCase struct {
	repo OrderRepository
}

func NewOrderUseCase(r OrderRepository) *OrderUseCase {
	return &OrderUseCase{repo: r}
}

func (uc *OrderUseCase) PlaceOrder(order Order) error {
	if order.Total <= 0 {
		return errors.New("order total must be positive")
	}
	return uc.repo.Save(order)
}

// Adapter (Outbound Memory Implementor)
type MemoryRepository struct {
	store map[string]Order
}

func (m *MemoryRepository) Save(order Order) error {
	m.store[order.ID] = order
	return nil
}

func main() {
	repo := &MemoryRepository{store: make(map[string]Order)}
	useCase := NewOrderUseCase(repo)
	
	newOrder := Order{ID: "ord_9901", Total: 199.95}
	if err := useCase.PlaceOrder(newOrder); err != nil {
		panic(err)
	}
}`,
      description: "Master Hexagonal architecture in Go. Decouple business domains from persistence drivers, adapters, and interface boundaries.",
      estimatedWpmGoal: 76
    }
  ],
  python: [
    {
      id: 1,
      title: "List Comprehensions and OS Module",
      concept: "File system scanning, string filters, and high-efficiency list expressions.",
      project: "Automatic Log Rotation Maintenance Script",
      code: `import os

def rotate_and_clean_logs(target_dir: str, limit_bytes: int):
    if not os.path.exists(target_dir):
        print(f"Directory {target_dir} does not exist.")
        return

    # Comprehensions identify logs efficiently
    log_files = [
        os.path.join(target_dir, f)
        for f in os.listdir(target_dir)
        if f.endswith(".log") and os.path.isfile(os.path.join(target_dir, f))
    ]

    for log_path in log_files:
        file_size = os.path.getsize(log_path)
        if file_size > limit_bytes:
            rotated_name = f"{log_path}.old"
            if os.path.exists(rotated_name):
                os.remove(rotated_name)
            os.rename(log_path, rotated_name)
            print(f"Rotated file: {log_path} -> {rotated_name}")
        else:
            print(f"Skipping small file: {log_path} ({file_size} bytes)")

if __name__ == "__main__":
    rotate_and_clean_logs("./logs", 1024 * 1024)`,
      description: "Learn Python directory iteration, OS module hooks, safe renaming procedures, and powerful list comprehensions.",
      estimatedWpmGoal: 22
    },
    {
      id: 2,
      title: "Decorators and Context Managers",
      concept: "Wrapping function lifecycles, timing, and automated context cleanup hooks.",
      project: "Performance Profiler Wrapper and DB Context Mimic",
      code: `import time
from typing import Callable, Any

def performance_timer(func: Callable[..., Any]) -> Callable[..., Any]:
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start_time
        print(f"[Timer] Function '{func.__name__}' ran in {elapsed:.6f}s")
        return result
    return wrapper

class DatabaseConnection:
    def __init__(self, dsn: str):
        self.dsn = dsn
        self.connected = False

    def __enter__(self):
        self.connected = True
        print(f"Established transaction bound to {self.dsn}")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.connected = False
        print("Closed connection bound database successfully")
        if exc_type:
            print(f"Rolling back connection because of exception: {exc_val}")
            return False # Propagate error
        return True

@performance_timer
def run_heavy_db_transaction():
    with DatabaseConnection("postgresql://db_master") as db:
        print(f"Executing analytical queries on connected instance: {db.connected}")
        time.sleep(0.15)

if __name__ == "__main__":
    run_heavy_db_transaction()`,
      description: "Understand Pythonic meta-programming: building function decorators, defining __enter__ and __exit__ methods, and scoping transactions.",
      estimatedWpmGoal: 28
    },
    {
      id: 3,
      title: "Asynchronous I/O: Asyncio and Coroutines",
      concept: "Asynchronous task event loops, concurrent execution structures, and network speed tracking.",
      project: "Concurrent Network Server Availability Health Crawler",
      code: `import asyncio
import random
from typing import Dict, Any

async def check_api_health(endpoint: str) -> Dict[str, Any]:
    print(f"Starting async ping task for: {endpoint}")
    # Simulating non-blocking asynchronous HTTP network lag
    simulated_ping = random.uniform(0.1, 0.8)
    await asyncio.sleep(simulated_ping)
    
    online = random.choice([True, True, True, False]) # 75% online chance
    return {
        "endpoint": endpoint,
        "latency": f"{simulated_ping * 1000:.1f}ms",
        "status": "Healthy" if online else "Offline"
    }

async def main():
    endpoints = [
        "https://api.github.com",
        "https://api.stripe.com",
        "https://api.openai.com",
    ]
    
    print("Initiating concurrent crawler loop...")
    tasks = [check_api_health(url) for url in endpoints]
    
    # Run tasks concurrently in event loop
    results = await asyncio.gather(*tasks)
    
    for record in results:
        print(f"Result -> Endpt: {record['endpoint']} | Ping: {record['latency']} | Status: {record['status']}")

if __name__ == "__main__":
    asyncio.run(main())`,
      description: "Master Python async features. Learn coroutines, event loop scheduling, non-blocking time delays, and gathering parallel execution lists.",
      estimatedWpmGoal: 34
    },
    {
      id: 4,
      title: "Pydantic and Robust Type Hinting",
      concept: "Data validation, strict typing schemas, custom serializers, and model errors.",
      project: "E-Commerce Webhook Validation Engine",
      code: `from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator

class ProductItem(BaseModel):
    sku: str = Field(..., min_length=4, max_length=12)
    price: float = Field(..., gt=0.0)
    quantity: int = Field(..., ge=1)

class WebhookPayload(BaseModel):
    transaction_id: str
    customer_email: EmailStr
    items: List[ProductItem]
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    promo_code: Optional[str] = None

    @field_validator("items")
    @classmethod
    def check_non_empty_items(cls, value: List[ProductItem]) -> List[ProductItem]:
        if len(value) == 0:
            raise ValueError("Cart must contain at least one valid line item")
        return value

def process_webhook(raw_json: dict):
    try:
        payload = WebhookPayload.model_validate(raw_json)
        print(f"Parsed webhook {payload.transaction_id} safely.")
        return payload
    except Exception as e:
        print(f"Schema Validation Error encountered: \\n{e}")
        return None`,
      description: "Write production data schemas. Understand type hinting, using Pydantic BaseModel, Field bounds, and writing class validation decorators.",
      estimatedWpmGoal: 40
    },
    {
      id: 5,
      title: "Advanced OOP and Custom Metaclasses",
      concept: "Advanced inheritance, custom attribute hook checks, and runtime class constraints.",
      project: "Self-Validating Configuration Engine",
      code: `class ContractMeta(type):
    def __new__(cls, name, bases, attrs):
        # Enforce that all contract subclasses define 'execute' method
        if name != "BaseContract" and "execute" not in attrs:
            raise TypeError(f"Class '{name}' must implement the abstract 'execute' method.")
        return super().__new__(cls, name, bases, attrs)

class BaseContract(metaclass=ContractMeta):
    def run_safe(self) -> str:
        print("Pre-execution system checks: PASSED")
        return self.execute()

class PaymentContract(BaseContract):
    def __init__(self, amount: float):
        self.amount = amount

    def execute(self) -> str:
        return f"Settled payment ledger value of: USD {self.amount:.2f}"

if __name__ == "__main__":
    contract = PaymentContract(1500.50)
    print(contract.run_safe())
    
    try:
        # This subclass definition will fail immediately at runtime load:
        class BrokenContract(BaseContract):
            pass
    except TypeError as e:
        print(f"Metaclass block succeeded: {e}")`,
      description: "Understand metaclasses in Python. Discover class interception hooks, strict architectural constraint enforcement, and custom type setups.",
      estimatedWpmGoal: 46
    },
    {
      id: 6,
      title: "REST APIs with Framework Handlers",
      concept: "Routing tables, HTTP request parsing, status codes, and JSON response models.",
      project: "Mini Task Management REST App Core",
      code: `from typing import Dict, Optional
import json

class TaskRouter:
    def __init__(self):
        self.store: Dict[int, dict] = {}
        self.id_counter = 1

    def handle_request(self, method: str, path: str, body_str: Optional[str] = None) -> tuple:
        if path == "/tasks" and method == "GET":
            return 200, json.dumps(list(self.store.values()))
            
        elif path == "/tasks" and method == "POST":
            if not body_str:
                return 400, json.dumps({"error": "Empty Request Body"})
            data = json.loads(body_str)
            task_id = self.id_counter
            self.id_counter += 1
            
            new_task = {"id": task_id, "title": data["title"], "done": False}
            self.store[task_id] = new_task
            return 201, json.dumps(new_task)
            
        return 404, json.dumps({"error": "Endpoint Not Found"})

if __name__ == "__main__":
    router = TaskRouter()
    code_201, res_task = router.handle_request("POST", "/tasks", '{"title": "Implement WebSockets"}')
    code_200, res_list = router.handle_request("GET", "/tasks")
    print(f"Response {code_201}: {res_task}")
    print(f"List {code_200}: {res_list}")`,
      description: "Build API endpoints manually without heavy external frameworks. Handle raw routing states, HTTP action toggles, JSON responses, and in-memory caches.",
      estimatedWpmGoal: 52
    },
    {
      id: 7,
      title: "High-Efficiency Generator Pipelines",
      concept: "Memory-efficient data pipelines, generator yield loops, and parsing massive files.",
      project: "Lazy-Loaded Large File Parser Flow",
      code: `from typing import Generator, Dict, Any

def csv_record_reader(filepath: str) -> Generator[Dict[str, str], None, None]:
    # Generator yields records one at a time, conserving RAM
    with open(filepath, "r", encoding="utf-8") as file:
        headers = file.readline().strip().split(",")
        for line in file:
            values = line.strip().split(",")
            if len(values) == len(headers):
                yield dict(zip(headers, values))

def error_filter_pipeline(records: Generator[Dict[str, str], None, None]) -> Generator[Dict[str, str], None, None]:
    for record in records:
        if record.get("level") == "ERROR" or record.get("status") == "500":
            yield record

def run_analytics_pipeline():
    # Setup dummy log data
    raw_records = [
        {"timestamp": "12:00", "level": "INFO", "message": "Success"},
        {"timestamp": "12:01", "level": "ERROR", "message": "Connection timeout"},
        {"timestamp": "12:02", "level": "DEBUG", "message": "No action"},
    ]
    
    # Piping generators together
    filtered = (r for r in raw_records if r["level"] == "ERROR")
    for error in filtered:
        print(f"[PIPELINE ERROR ALERT] Trace: {error['timestamp']} - {error['message']}")

if __name__ == "__main__":
    run_analytics_pipeline()`,
      description: "Learn generator pipeline chaining, standard streaming paradigms, performance memory optimizations, and lazy iteration loops.",
      estimatedWpmGoal: 58
    },
    {
      id: 8,
      title: "Testing and Mocking with Pytest",
      concept: "Isolating testing units, mocking API network endpoints, and defining fixtures.",
      project: "Robust User Registration Test Pipeline",
      code: `import pytest
from unittest.mock import Mock, patch

class EmailClient:
    def send_confirmation(self, email: str) -> bool:
        # In production this calls a third-party server
        raise ConnectionError("Network client server offline")

class UserRegisterService:
    def __init__(self, mailer: EmailClient):
        self.mailer = mailer

    def register_user(self, email: str) -> str:
        if "@" not in email:
            raise ValueError("Email layout schema invalid")
        sent = self.mailer.send_confirmation(email)
        return "SUCCESS" if sent else "FAILED"

def test_registration_with_mocked_mailer():
    # Build mocking environment to avoid real network attempts
    mock_mailer = Mock(spec=EmailClient)
    mock_mailer.send_confirmation.return_value = True
    
    service = UserRegisterService(mailer=mock_mailer)
    result = service.register_user("dev@google.com")
    
    assert result == "SUCCESS"
    mock_mailer.send_confirmation.assert_called_once_with("dev@google.com")

def test_invalid_email_schema_rejects():
    mock_mailer = Mock()
    service = UserRegisterService(mailer=mock_mailer)
    with pytest.raises(ValueError):
        service.register_user("broken-email-address")`,
      description: "Discover Python's testing capabilities. Learn unit-testing syntax, assertion structures, mock injection, and exception assertions.",
      estimatedWpmGoal: 64
    },
    {
      id: 9,
      title: "Structural Design Patterns",
      concept: "Creating cohesive systems with Design Patterns: Factory and Singleton with thread safety.",
      project: "Database Logging Broker System",
      code: `import threading
from typing import Dict, Type

class LoggerSingleton:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        # Double-checked locking pattern for absolute thread safety
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super().__new__(cls)
                    cls._instance.initialized = True
                    cls._instance.logs = []
        return cls._instance

    def log(self, message: str):
        self.logs.append(message)

class StorageAdapter:
    def save(self, data: str): pass

class DiskStorage(StorageAdapter):
    def save(self, data: str): print(f"Wrote to disk: {data}")

class CloudStorage(StorageAdapter):
    def save(self, data: str): print(f"Uploaded to Cloud: {data}")

class StorageFactory:
    _registry: Dict[str, Type[StorageAdapter]] = {
        "disk": DiskStorage,
        "cloud": CloudStorage,
    }

    @classmethod
    def get_adapter(cls, name: str) -> StorageAdapter:
        adapter_cls = cls._registry.get(name.lower())
        if not adapter_cls:
            raise ValueError(f"Unknown driver: {name}")
        return adapter_cls()`,
      description: "Write clean architectures in Python. Implement a thread-safe singleton, build object factories, and manage registries safely.",
      estimatedWpmGoal: 70
    },
    {
      id: 10,
      title: "High-Performance Concurrency",
      concept: "CPU-bound task distribution, process pools, shared memory limits, and batch operations.",
      project: "CPU-Intense Image Data Processing Pipeline",
      code: `import multiprocessing
import math
from typing import List

def calculate_heavy_factorial_chunk(numbers: List[int]) -> List[int]:
    # Simulate CPU intensive cryptographic math tasks
    results = []
    for val in numbers:
        results.append(math.factorial(val % 100)) # Keep numbers stable
    return results

def run_multiprocess_workers(data: List[int]):
    num_cores = multiprocessing.cpu_count()
    chunk_size = len(data) // num_cores
    
    print(f"Spinning up process pool with {num_cores} native OS threads...")
    chunks = [
        data[i : i + chunk_size]
        for i in range(0, len(data), chunk_size)
    ]
    
    with multiprocessing.Pool(processes=num_cores) as pool:
        # Processes run truly parallel bypass GIL limits
        processed_chunks = pool.map(calculate_heavy_factorial_chunk, chunks)
        
    flat_results = [item for sublist in processed_chunks for item in sublist]
    print(f"Processed total of {len(flat_results)} calculations successfully.")

if __name__ == "__main__":
    test_work = list(range(1, 1001))
    run_multiprocess_workers(test_work)`,
      description: "Learn how to bypass Python's Global Interpreter Lock (GIL). Understand CPU-bound multiprocess structures, cores splitting, and data chunking.",
      estimatedWpmGoal: 76
    }
  ]
};
