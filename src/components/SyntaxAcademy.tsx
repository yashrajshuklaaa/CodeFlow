import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  BrainCircuit, 
  Code, 
  Sparkles, 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award,
  Terminal,
  Zap,
  Layers,
  Activity,
  Heart
} from 'lucide-react';

interface SyntaxAcademyProps {
  onSelectDrill: (code: string, title: string, concept: string) => void;
  onAwardXP: (amount: number) => void;
}

interface ConceptDetail {
  id: string;
  title: string;
  description: string;
  goConcept: string;
  pyConcept: string;
  goCode: string;
  pyCode: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const CONCEPTS: ConceptDetail[] = [
  {
    id: 'variables',
    title: 'Variables & Strict Typing',
    difficulty: 'Beginner',
    description: 'Learn how variables are allocated in memory. Go uses strict static compilation and zero-value defaults, while Python offers extreme dynamic flexibility.',
    goConcept: 'Go is statically typed. Variables must be declared with a type, or inferred using the short-declaration format (:=) inside functions. Declared variables that are unassigned are automatically zero-initialized (e.g., int defaults to 0, bool to false). Unused variables trigger compiler errors!',
    pyConcept: 'Python is dynamically typed. Variables are initialized on assignment and can be re-bound to any data type at runtime. There is no zero-initialization or compiler check for unused variables. Pointers or strict types are not required, though PEP 484 type hints are optional and recommended.',
    goCode: `package main
import "fmt"

func main() {
    var count int = 10
    message := "Active Session"
    var isReady bool // defaults to false
    
    fmt.Printf("Ready: %t | Msg: %s | Count: %d\\n", isReady, message, count)
}`,
    pyCode: `count = 10
message = "Active Session"
is_ready = False # explicit assignment

print(f"Ready: {is_ready} | Msg: {message} | Count: {count}")`
  },
  {
    id: 'control-flow',
    title: 'Loops & Control Flow',
    difficulty: 'Beginner',
    description: 'Explore looping constraints. Go embraces syntactic minimalism with a single "for" keyword, while Python relies on whitespace indentation and iterable ranges.',
    goConcept: 'Go simplifies syntax by omitting while and do-while loops entirely. A single "for" keyword handles all iteration states: classical 3-part counters, conditional loops (mimicking while), and range-based iterators. Brackets are mandatory, parentheses are omitted.',
    pyConcept: 'Python supports both "for" loops (which iterate over lists, strings, or range generators) and "while" loops. Conditional statements omit parentheses but mandate colons and strict block indentation. Multi-branch branches are declared via "elif".',
    goCode: `package main
import "fmt"

func main() {
    // 3-part loop
    for i := 1; i <= 3; i++ {
        if i == 2 {
            fmt.Println("Midpoint reached!")
        }
    }
}`,
    pyCode: `# Range-based generator loop
for i in range(1, 4):
    if i == 2:
        print("Midpoint reached!")`
  },
  {
    id: 'collections',
    title: 'Dynamic Slices vs Lists',
    difficulty: 'Intermediate',
    description: 'Understand in-memory storage of sequences. Go slices wrap static pointers with strict type boundaries, while Python lists hold variable-type references.',
    goConcept: 'Go has fixed-size Arrays and dynamic Slices. Slices represent lightweight window views into underlying arrays. Append operations return a new slice reference if capacity boundaries are exceeded. Map structures are strictly typed hash maps.',
    pyConcept: 'Python has dynamic, multi-type Lists and Dictionaries. Lists can store mixed elements (integers, strings, objects) and grow automatically. Dictionaries are highly-optimized hash arrays that preserve insertion ordering since Python 3.7.',
    goCode: `package main
import "fmt"

func main() {
    items := []string{"CPU", "GPU"}
    scores := map[string]int{"admin": 100}
    
    items = append(items, "RAM")
    scores["guest"] = 50
    fmt.Println("Items:", items, "Scores:", scores)
}`,
    pyCode: `items = ["CPU", "GPU"]
scores = {"admin": 100}

items.append("RAM")
scores["guest"] = 50
print("Items:", items, "Scores:", scores)`
  },
  {
    id: 'error-handling',
    title: 'Explicit Errors vs Try-Catch',
    difficulty: 'Intermediate',
    description: 'Compare application resilience strategies. Go treats errors as values requiring prompt handling, whereas Python leverages standard exception bubbling.',
    goConcept: 'Go rejects Try-Catch structures. Instead, functions return multiple values, with an "error" interface type as the last return. Coders must explicitly test if err != nil after execution. This forces proactive debugging at the exact site of failure.',
    pyConcept: 'Python uses standard exception handling with try, except, else, and finally blocks. If an execution fails, it throws/raises an Exception that bubbles up the call stack until intercepted, making code cleaner but occasionally masking silent crash vectors.',
    goCode: `package main
import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("zero division")
    }
    return a / b, nil
}

func main() {
    res, err := divide(10, 0)
    if err != nil {
        fmt.Println("Fatal error:", err)
        return
    }
    fmt.Println("Success:", res)
}`,
    pyCode: `def divide(a: float, b: float):
    if b == 0:
        raise ValueError("zero division")
    return a / b

try:
    res = divide(10, 0)
    print("Success:", res)
except ValueError as e:
    print("Fatal error:", e)`
  },
  {
    id: 'pointers',
    title: 'Memory: Pointers vs References',
    difficulty: 'Intermediate',
    description: 'Learn memory management. Go provides raw, safe pointer address controls. Python manages everything through reference tracking on the heap.',
    goConcept: 'Go supports pointers, allowing explicit call-by-reference using memory addresses (*int, &val). This prevents bulky value copying during method calls. Go compiler performs automatic escape analysis to determine heap vs stack allocation.',
    pyConcept: 'Python operates entirely via object references on the heap. Passing arguments transfers references to mutable or immutable objects. There are no explicit pointers, addresses, or dereference operators; memory cleanup is handled by automatic Garbage Collection.',
    goCode: `package main
import "fmt"

func increment(val *int) {
    *val = *val + 1 // dereference and increment
}

func main() {
    num := 42
    increment(&num) // pass memory address
    fmt.Println("Pointer value is now:", num)
}`,
    pyCode: `class Counter:
    def __init__(self, value):
        self.value = value

def increment(counter_obj):
    counter_obj.value += 1 # mutates referenced object

c = Counter(42)
increment(c)
print("Reference value is now:", c.value)`
  },
  {
    id: 'concurrency',
    title: 'Goroutines vs Asyncio Event Loops',
    difficulty: 'Advanced',
    description: 'Master asynchronous architectures. Go implements native, multi-threaded CSP goroutines, while Python schedules cooperative asynchronous coroutines.',
    goConcept: 'Go concurrency uses Goroutines (go keyword) and Channels. It follows Communicating Sequential Processes (CSP). Goroutines are multiplexed onto native OS threads, running concurrently on all CPU cores without locks.',
    pyConcept: 'Python concurrency is traditionally single-threaded due to the Global Interpreter Lock (GIL). It utilizes cooperative multitasking with "asyncio". The event loop schedules coroutines ("async def") on a single core using "await" release points.',
    goCode: `package main
import (
    "fmt"
    "time"
)

func worker(ch chan string) {
    time.Sleep(100 * time.Millisecond)
    ch <- "Task completed!"
}

func main() {
    ch := make(chan string)
    go worker(ch)
    fmt.Println(<-ch) // blocks until channel receives
}`,
    pyCode: `import asyncio

async def worker():
    await asyncio.sleep(0.1)
    return "Task completed!"

async def main():
    result = await worker()
    print(result)

if __name__ == "__main__":
    asyncio.run(main())`
  },
  {
    id: 'oop-vs-structs',
    title: 'OOP: Classes vs. Structs & Interfaces',
    difficulty: 'Intermediate',
    description: 'Learn the difference between classical inheritance and composition. Python supports multi-class inheritance with traditional objects, while Go focuses on struct composition and implicit interfaces.',
    goConcept: 'Go does not have classes or classical inheritance. Instead, it uses Structs to store state and Methods to bind behavior. Reusability is achieved through Struct Composition (embedding fields). Interfaces are satisfied implicitly—no "implements" keyword is required, which decouples caller and implementation.',
    pyConcept: 'Python is a classical OOP language. Classes support multiple inheritance, base class constructor delegation via "super()", and custom attribute access intercepts. Dynamic duck-typing allows any object to be used if it implements required methods, but type checking must be done at runtime.',
    goCode: `package main
import "fmt"

type Speaker interface {
    Speak() string
}

type Dog struct {
    Name string
}

func (d Dog) Speak() string {
    return "Woof!"
}

func main() {
    var s Speaker = Dog{Name: "Rex"}
    fmt.Println(s.Speak())
}`,
    pyCode: `class Speaker:
    def speak(self) -> str:
        raise NotImplementedError

class Dog(Speaker):
    def __init__(self, name: str):
        self.name = name
    def speak(self) -> str:
        return "Woof!"

d = Dog("Rex")
print(d.speak())`
  },
  {
    id: 'decorators-vs-middleware',
    title: 'Functions: Decorators vs. Wrappers',
    difficulty: 'Intermediate',
    description: 'Examine advanced functional design. Python uses "@decorator" syntactic sugar to wrap execution, while Go structures function chains with explicit closures.',
    goConcept: 'Go functions are first-class citizens. You can pass them as arguments, return them from other functions, or define them inline. Middlewares and function wrapping are achieved through explicit functional chain closures: a decorator function takes a function type and returns a wrapped function of the same type.',
    pyConcept: 'Python has built-in decorators using "@" prefix notation. A decorator is a higher-order function that wraps and modifies the behavior of another function or class. Decorators can be stacked, receive arguments, and are parsed at import time to alter the runtime function bindings.',
    goCode: `package main
import "fmt"

type Action func()

func WithLogger(fn Action) Action {
    return func() {
        fmt.Println("[LOG] Action starting")
        fn()
        fmt.Println("[LOG] Action finished")
    }
}

func main() {
    hello := func() { fmt.Println("Hello!") }
    wrapped := WithLogger(hello)
    wrapped()
}`,
    pyCode: `def with_logger(func):
    def wrapper(*args, **kwargs):
        print("[LOG] Action starting")
        res = func(*args, **kwargs)
        print("[LOG] Action finished")
        return res
    return wrapper

@with_logger
def hello():
    print("Hello!")

hello()`
  },
  {
    id: 'modules-imports',
    title: 'Packaging: Module Scopes & Exports',
    difficulty: 'Beginner',
    description: 'Inspect code organization and package isolation. Go relies on capitalized names for exports within single-package directories, while Python relies on package import routes and modules.',
    goConcept: 'In Go, visibility is controlled by typography! A variable, struct, or function is exported (public) if its name starts with an uppercase letter (e.g. ExportedFunc). If it starts with a lowercase letter, it is package-private. Files in the same folder must share the same "package" statement and have access to all package members without explicit imports.',
    pyConcept: 'In Python, every file is a module, and folders with "__init__.py" files form packages. Scope visibility relies on explicit naming conventions: a single underscore prefix ("_private") suggests internal use, and double underscores ("__mangled") trigger name mangling. All elements can still be explicitly imported unless restricted by "__all__".',
    goCode: `package auth

import "fmt"

// Login is exported (Uppercase)
func Login(user string) {
    fmt.Println("User logged in:", user)
}

// validate checks the password (Lowercase, private)
func validate(pass string) bool {
    return len(pass) > 8
}`,
    pyCode: `# auth.py module

def login(user: str):
    """Public helper function"""
    print(f"User logged in: {user}")

def _validate(pass_str: str) -> bool:
    """Semi-private helper (by convention)"""
    return len(pass_str) > 8`
  }
];

interface QuizQuestion {
  question: string;
  lang: 'Go' | 'Python' | 'Both';
  options: string[];
  answerIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Which keyword does Go use to support all variations of loops (including standard counter loops and conditional loops)?",
    lang: "Go",
    options: ["while", "for", "loop", "range"],
    answerIndex: 1,
    explanation: "Go embraces syntactic minimalism by having 'for' as its only looping keyword. It is used for classic counters, conditional checks (like while), and map/slice ranges."
  },
  {
    question: "What is the automatic default behavior for a declared variable in Go that is not explicitly initialized?",
    lang: "Go",
    options: ["It remains undefined", "It raises a compiler crash", "It is zero-initialized based on type", "It contains random garbage bits"],
    answerIndex: 2,
    explanation: "Go automatically zero-initializes variables to their default zero-value (e.g., 0 for numeric types, false for booleans, empty string for strings) to ensure memory safety."
  },
  {
    question: "How does Python handle parameter passing when mutable structures like lists are passed to functions?",
    lang: "Python",
    options: ["Pass-by-value (copies the whole list)", "Pass-by-reference (modifies the original list)", "Pass-by-value-result", "Immutable locking"],
    answerIndex: 1,
    explanation: "In Python, everything is passed by object reference. When a mutable object like a list is passed, modifications affect the original list because both share the same reference."
  },
  {
    question: "What does the symbol ':=' represent in Go?",
    lang: "Go",
    options: ["Pointers comparison", "A constant declaration modifier", "Short-variable declaration with type inference", "A pointer address reference"],
    answerIndex: 2,
    explanation: "The short-variable declaration ':=' is a Go-specific syntactic sugar that infers the type of a new variable automatically. It can only be used inside functions."
  },
  {
    question: "Which feature is traditionally responsible for restricting Python from executing multi-threaded code across multiple native CPU cores simultaneously?",
    lang: "Python",
    options: ["The Global Interpreter Lock (GIL)", "Statically linked imports", "Garbage collector sweep", "Cooperative coroutines limits"],
    answerIndex: 0,
    explanation: "The Global Interpreter Lock (GIL) is a mutex that prevents multiple native threads from executing Python bytecodes at once, protecting Python's memory management."
  },
  {
    question: "How are errors traditionally handled in Go, unlike Python's Try-Except blocks?",
    lang: "Both",
    options: ["Explicit exception throwing", "Returning errors as ordinary values to test", "Compiling them into silent warning logs", "By panicking and terminating immediately"],
    answerIndex: 1,
    explanation: "Go handles errors explicitly by treating them as standard values. Functions return an error as their final value, and the caller checks 'if err != nil'."
  },
  {
    question: "How does Go control whether a function, struct, or variable is public (exported) or private (package-internal)?",
    lang: "Go",
    options: ["By using the 'public' and 'private' keywords", "By starting the identifier name with an uppercase letter for public, or lowercase for private", "By declaring them inside specific block enclosures", "By configuring exports in an external go.mod configuration file"],
    answerIndex: 1,
    explanation: "Go uses typography for access control: any identifier starting with an uppercase letter is automatically exported (public), while a lowercase letter makes it package-private."
  },
  {
    question: "What is the primary difference in how Go and Python satisfy interfaces or duck-typing?",
    lang: "Both",
    options: ["Go requires an explicit 'implements' keyword; Python checks types strictly at build-time", "Go interfaces are satisfied implicitly (struct only needs the methods); Python dynamically checks attributes at runtime", "Both languages require strict abstract base classes to be registered before execution", "Neither language supports interface patterns"],
    answerIndex: 1,
    explanation: "Go implements interfaces implicitly (structs satisfy interfaces without declared binding keywords). Python supports dynamic duck-typing, checking for methods or attributes during runtime execution."
  },
  {
    question: "How do you stack decorators in Python, and when are they evaluated?",
    lang: "Python",
    options: ["Using the '+' operator; evaluated when the function completes", "By nesting function calls explicitly; evaluated at startup", "By placing '@decorator' lines vertically above the target function; evaluated during module import time", "Using parenthetical tags; evaluated on every garbage collection cycle"],
    answerIndex: 2,
    explanation: "In Python, you can stack multiple '@decorator' statements vertically on top of each other. They are parsed and applied in a bottom-up order when the module is first imported."
  }
];

export const SyntaxAcademy: React.FC<SyntaxAcademyProps> = ({ onSelectDrill, onAwardXP }) => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'quiz'>('concepts');
  
  // Concept View States
  const [selectedConcept, setSelectedConcept] = useState<ConceptDetail>(CONCEPTS[0]);
  const [selectedLangMode, setSelectedLangMode] = useState<'both' | 'go' | 'python'>('both');

  // Quiz States
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [xpEarnedTotal, setXpEarnedTotal] = useState<number>(0);

  const handleSelectAnswer = (optionIdx: number) => {
    if (answered) return;
    setSelectedAnswer(optionIdx);
    setAnswered(true);

    const currentQuestion = QUIZ_QUESTIONS[currentQuizIndex];
    if (optionIdx === currentQuestion.answerIndex) {
      setScore((prev) => prev + 1);
      const bonusXP = 20; // 20 XP per correct answer!
      setXpEarnedTotal((prev) => prev + bonusXP);
      onAwardXP(bonusXP);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setAnswered(false);
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setXpEarnedTotal(0);
  };

  const handleLoadSnippet = (code: string, isGo: boolean) => {
    const title = `${selectedConcept.title} (${isGo ? 'Go' : 'Python'})`;
    const explanation = `Concept practice: ${selectedConcept.title}. Underline syntactic layouts and indentation.`;
    onSelectDrill(code, title, explanation);
  };

  return (
    <div id="syntax-academy-root" className="bg-white/90 rounded-2xl border border-[#D0D4FC]/60 p-5 shadow-xs flex flex-col gap-5 backdrop-blur-md">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D0D4FC]/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl text-white shadow-md shadow-indigo-100">
            <GraduationCap size={22} />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#1E1E2E] tracking-tight font-display flex items-center gap-2">
              <span>Syntax Academy</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full border border-indigo-200 uppercase font-sans">interactive</span>
            </h2>
            <p className="text-xs text-[#5C5C7A] mt-0.5 font-sans">Dual-track companion teaching variable scopes, control flows, loops, and memory architectures.</p>
          </div>
        </div>

        {/* View Switch Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 h-fit self-start md:self-center">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer font-display ${
              activeTab === 'concepts'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-[#5C5C7A] hover:text-[#1E1E2E]'
            }`}
          >
            <BookOpen size={14} />
            <span>Interactive Guides</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer font-display ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-[#5C5C7A] hover:text-[#1E1E2E]'
            }`}
          >
            <BrainCircuit size={14} />
            <span>Syntax Quiz Arena</span>
          </button>
        </div>
      </div>

      {/* guides content */}
      {activeTab === 'concepts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left index: List of syllabus concepts */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <h4 className="text-[10px] font-black uppercase text-[#7C7C9A] tracking-wider mb-1 font-sans">Programming Concepts</h4>
            <div className="flex flex-col gap-1.5 max-h-[360px] overflow-y-auto pr-1">
              {CONCEPTS.map((concept) => {
                const isSelected = selectedConcept.id === concept.id;
                return (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedConcept(concept)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/75 border-indigo-300 shadow-2xs'
                        : 'bg-slate-50/50 border-slate-200/50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Code size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[9px] font-bold uppercase tracking-wide ${
                          isSelected ? 'text-indigo-600' : 'text-[#7C7C9A]'
                        }`}>
                          {concept.difficulty}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-[#1E1E2E] truncate font-display">{concept.title}</h5>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick coaching info */}
            <div className="bg-gradient-to-tr from-indigo-50/50 to-purple-50/50 rounded-xl p-3 border border-[#D0D4FC]/40 mt-2 font-sans">
              <div className="flex items-center gap-2 text-indigo-700">
                <Zap size={14} className="shrink-0" />
                <span className="text-[11px] font-bold font-display">Muscle Memory Link</span>
              </div>
              <p className="text-[10px] text-[#5C5C7A] mt-1 leading-relaxed">
                Click any code snippet on the right to load it directly into the typing area. Mastering syntax requires physical finger automation!
              </p>
            </div>
          </div>

          {/* Right workspace: Comparative display cards */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Explainer Summary */}
            <div className="bg-slate-50/70 border border-slate-200/50 rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-sm font-black text-[#1E1E2E] font-display">{selectedConcept.title}</h3>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  selectedConcept.difficulty === 'Beginner' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : selectedConcept.difficulty === 'Intermediate'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  {selectedConcept.difficulty}
                </span>
              </div>
              <p className="text-xs text-[#5C5C7A] leading-relaxed font-sans">{selectedConcept.description}</p>
            </div>

            {/* Format toggle: Both side-by-side vs Single */}
            <div className="flex gap-2 bg-slate-100 p-0.5 rounded-lg border border-slate-200/50 w-fit self-end text-[10px]">
              <button 
                onClick={() => setSelectedLangMode('both')} 
                className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer font-display ${selectedLangMode === 'both' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-[#7C7C9A]'}`}
              >
                Go & Python Split
              </button>
              <button 
                onClick={() => setSelectedLangMode('go')} 
                className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer font-display ${selectedLangMode === 'go' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-[#7C7C9A]'}`}
              >
                Go Only
              </button>
              <button 
                onClick={() => setSelectedLangMode('python')} 
                className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer font-display ${selectedLangMode === 'python' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-[#7C7C9A]'}`}
              >
                Python Only
              </button>
            </div>

            {/* Core code snippets workspace */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* GO SNIPPET */}
              {(selectedLangMode === 'both' || selectedLangMode === 'go') && (
                <div className={`${selectedLangMode === 'both' ? 'md:col-span-6' : 'md:col-span-12'} flex flex-col gap-2.5`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-sans">Golang (Static)</span>
                    <button
                      onClick={() => handleLoadSnippet(selectedConcept.goCode, true)}
                      className="text-[10px] font-extrabold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-display shadow-2xs"
                    >
                      <Play size={10} fill="currentColor" />
                      <span>Practice Go Typing</span>
                    </button>
                  </div>

                  <div className="bg-[#0b0e14] border border-[#1f2937]/30 rounded-xl p-3.5 shadow-sm min-h-[180px] flex flex-col justify-between">
                    <pre className="font-mono text-xs text-[#99C7FF] overflow-x-auto whitespace-pre leading-relaxed custom-scrollbar max-h-[220px]">
                      {selectedConcept.goCode}
                    </pre>
                  </div>

                  <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-3">
                    <h6 className="text-[10px] font-black uppercase text-indigo-800 tracking-wider font-display mb-1">Architecture & Compilation</h6>
                    <p className="text-[11px] text-[#5C5C7A] leading-relaxed font-sans">{selectedConcept.goConcept}</p>
                  </div>
                </div>
              )}

              {/* PYTHON SNIPPET */}
              {(selectedLangMode === 'both' || selectedLangMode === 'python') && (
                <div className={`${selectedLangMode === 'both' ? 'md:col-span-6' : 'md:col-span-12'} flex flex-col gap-2.5`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-yellow-800 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200 font-sans">Python (Dynamic)</span>
                    <button
                      onClick={() => handleLoadSnippet(selectedConcept.pyCode, false)}
                      className="text-[10px] font-extrabold text-yellow-800 hover:text-white bg-yellow-50 hover:bg-yellow-600 border border-yellow-200 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-display shadow-2xs"
                    >
                      <Play size={10} fill="currentColor" />
                      <span>Practice Python Typing</span>
                    </button>
                  </div>

                  <div className="bg-[#0b0e14] border border-[#1f2937]/30 rounded-xl p-3.5 shadow-sm min-h-[180px] flex flex-col justify-between">
                    <pre className="font-mono text-xs text-[#EAD063] overflow-x-auto whitespace-pre leading-relaxed custom-scrollbar max-h-[220px]">
                      {selectedConcept.pyCode}
                    </pre>
                  </div>

                  <div className="bg-yellow-50/20 border border-yellow-100 rounded-xl p-3">
                    <h6 className="text-[10px] font-black uppercase text-yellow-800 tracking-wider font-display mb-1">Interpretation & Zen</h6>
                    <p className="text-[11px] text-[#5C5C7A] leading-relaxed font-sans">{selectedConcept.pyConcept}</p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* quiz content */}
      {activeTab === 'quiz' && (
        <div className="max-w-xl mx-auto w-full py-4 font-sans">
          <AnimatePresence mode="wait">
            {!quizFinished ? (
              <motion.div
                key={currentQuizIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-5"
              >
                {/* Progress bar info */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-[#5C5C7A]">Question {currentQuizIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                    Language focus: {QUIZ_QUESTIONS[currentQuizIndex].lang}
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all"
                    style={{ width: `${((currentQuizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                {/* Question body card */}
                <div className="bg-[#F8F9FE] border border-[#D0D4FC]/40 rounded-2xl p-5 shadow-2xs">
                  <h3 className="text-sm font-bold text-[#1E1E2E] leading-relaxed font-display">
                    {QUIZ_QUESTIONS[currentQuizIndex].question}
                  </h3>
                </div>

                {/* Multiple choice options */}
                <div className="flex flex-col gap-2.5">
                  {QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === QUIZ_QUESTIONS[currentQuizIndex].answerIndex;
                    
                    let btnClass = 'bg-white border-slate-200 hover:bg-indigo-50/35 hover:border-indigo-300';
                    if (answered) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                      } else if (isSelected) {
                        btnClass = 'bg-red-50 border-red-400 text-red-800';
                      } else {
                        btnClass = 'bg-slate-50/50 border-slate-200 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={answered}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {answered && isCorrect && (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        )}
                        {answered && isSelected && !isCorrect && (
                          <XCircle size={16} className="text-red-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanations & Next Buttons */}
                {answered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 flex flex-col gap-3"
                  >
                    <div>
                      <h5 className="text-[10px] font-black uppercase text-indigo-800 tracking-wider font-display mb-1">Syllabus Insights</h5>
                      <p className="text-[11px] text-[#5C5C7A] leading-relaxed font-sans">
                        {QUIZ_QUESTIONS[currentQuizIndex].explanation}
                      </p>
                    </div>
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center justify-center gap-1.5 self-end bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-xl transition shadow-sm text-xs cursor-pointer font-display"
                    >
                      <span>{currentQuizIndex === QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                      <ArrowRight size={12} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // Quiz Finished screen
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center flex flex-col items-center gap-4 py-6"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-50/80 text-indigo-600 flex items-center justify-center border border-indigo-200">
                  <Award size={36} className="animate-bounce" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#1E1E2E] font-display">Syntax Arena Finished!</h3>
                  <p className="text-xs text-[#5C5C7A] mt-1 font-sans">You have successfully run the programming syntax and logic diagnostic check.</p>
                </div>

                {/* Score indicators */}
                <div className="grid grid-cols-2 gap-3 my-4 w-full">
                  <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
                    <span className="text-[9px] font-bold uppercase text-[#7C7C9A]">Diagnostic Score</span>
                    <p className="text-2xl font-black text-indigo-600 mt-1 font-display">
                      {score} / {QUIZ_QUESTIONS.length}
                    </p>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4">
                    <span className="text-[9px] font-bold uppercase text-emerald-700">Experience Awarded</span>
                    <p className="text-2xl font-black text-emerald-600 mt-1 font-display">
                      +{xpEarnedTotal} XP
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleRestartQuiz}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#1E1E2E] font-bold py-3 rounded-xl transition text-xs border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer font-display"
                  >
                    <RotateCcw size={12} />
                    <span>Run Again</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('concepts')}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition text-xs shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer font-display"
                  >
                    <BookOpen size={12} />
                    <span>Back to Guides</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
};
