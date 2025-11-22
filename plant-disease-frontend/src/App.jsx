import UploadForm from "./components/UploadForm";
import React, { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle2, Loader2, Sparkles, Zap, Eye, X, Leaf, Image } from "lucide-react";

export default function PlantDiseaseDetector() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setUploadProgress(0);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedImage);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!response.ok) {
        throw new Error("Prediction failed");
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      clearInterval(progressInterval);
      setError("Failed to connect to server or prediction error.");
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1200);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      padding: "2rem",
      fontFamily: "Segoe UI,Roboto,sans-serif",
      position: "relative",
      overflow: "hidden",
    },
    floatingLeaf: {
      position: "absolute",
      opacity: 0.1,
      animation: "float 20s infinite ease-in-out",
      pointerEvents: "none",
    },
    header: {
      textAlign: "center",
      marginBottom: "3rem",
      color: "#fff",
      position: "relative",
      zIndex: 1,
    },
    title: {
      fontSize: "3.5rem",
      fontWeight: "bold",
      margin: "0 0 1rem 0",
      textShadow: "0 4px 20px rgba(67, 233, 123, 0.4)",
      background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
    },
    subtitle: {
      fontSize: "1.3rem",
      color: "#a8dadc",
      margin: 0,
      fontWeight: 300,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))",
      gap: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
      position: "relative",
      zIndex: 1,
    },
    card: {
      background: "rgba(255,255,255,0.95)",
      borderRadius: "24px",
      padding: "2.5rem",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.18)",
      transition: "all 0.3s ease",
      position: "relative",
      zIndex: 1,
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "1.5rem",
    },
    cardTitle: {
      fontSize: "1.6rem",
      fontWeight: "bold",
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      background: "linear-gradient(135deg, #2c5364 0%, #0f2027 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    uploadZone: {
      border: "3px dashed #43e97b",
      borderRadius: "20px",
      padding: "3rem",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      background: "linear-gradient(135deg, rgba(67, 233, 123, 0.05) 0%, rgba(56, 249, 215, 0.05) 100%)",
      position: "relative",
      overflow: "hidden",
    },
    uploadZoneHover: {
      border: "3px dashed #38a169",
      background: "linear-gradient(135deg, rgba(67, 233, 123, 0.15) 0%, rgba(56, 249, 215, 0.15) 100%)",
      transform: "scale(1.02)",
      boxShadow: "0 10px 40px rgba(67, 233, 123, 0.2)",
    },
    preview: {
      maxHeight: "350px",
      width: "100%",
      objectFit: "contain",
      borderRadius: "15px",
      boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
    },
    button: {
      width: "100%",
      padding: "1.2rem",
      fontSize: "1.1rem",
      fontWeight: "bold",
      border: "none",
      borderRadius: "15px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.7rem",
      marginTop: "1.5rem",
      background: "linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)",
      color: "white",
      boxShadow: "0 8px 25px rgba(67,233,123,0.3)",
      position: "relative",
      overflow: "hidden",
    },
    buttonDisabled: {
      background: "#c6f6d5",
      cursor: "not-allowed",
      boxShadow: "none",
    },
    progressBar: {
      height: "10px",
      background: "linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 100%)",
      borderRadius: "10px",
      overflow: "hidden",
      marginTop: "1rem",
    },
    progressFill: {
      height: "100%",
      background: "linear-gradient(90deg,#43e97b 0%,#38f9d7 100%)",
      transition: "width 0.3s ease",
      boxShadow: "0 0 20px rgba(67,233,123,0.5)",
    },
    error: {
      background: "linear-gradient(135deg, rgba(254,215,215,0.3), rgba(252,165,165,0.3))",
      border: "2px solid #e53e3e",
      borderRadius: "12px",
      padding: "1rem",
      marginTop: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      animation: "pulse 2s infinite",
    },
    resetButton: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "10px",
      transition: "all 0.3s ease",
      color: "#718096",
    },
    featureCard: {
      background: "rgba(255,255,255,0.98)",
      borderRadius: "20px",
      padding: "2rem",
      boxShadow: "0 8px 30px rgba(67,233,123,0.15)",
      border: "1px solid rgba(67,233,123,0.2)",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-40px) rotate(-5deg); }
          75% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 70px rgba(0,0,0,0.4);
        }
        .feature-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 45px rgba(67,233,123,0.3);
        }
        .button-hover:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(67,233,123,0.4);
        }
        .reset-hover:hover {
          background: rgba(255,255,255,0.1);
          color: #e53e3e;
        }
      `}</style>
      
      <div style={{...styles.floatingLeaf, top: "10%", left: "5%", fontSize: "4rem"}}>🌿</div>
      <div style={{...styles.floatingLeaf, top: "60%", right: "8%", fontSize: "3rem", animationDelay: "5s"}}>🍃</div>
      <div style={{...styles.floatingLeaf, bottom: "15%", left: "15%", fontSize: "3.5rem", animationDelay: "10s"}}>🌱</div>
      <div style={{...styles.floatingLeaf, top: "30%", right: "20%", fontSize: "2.5rem", animationDelay: "15s"}}>🌾</div>

      <div style={styles.header}>
        <h1 style={styles.title}>
          <Leaf size={48} color="#43e97b" />
          Plant Disease Detector
        </h1>
        <p style={styles.subtitle}>Harness AI to identify plant diseases instantly</p>
      </div>

      <div style={styles.grid}>
        
        {/* ---------- UPLOAD CARD ---------- */}
        <div style={styles.card} className="card-hover">
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              <Upload size={26}/>
              Upload Image
            </h2>
            {selectedImage && (
              <button
                style={styles.resetButton}
                className="reset-hover"
                onClick={handleReset}
              >
                <X size={22}/>
              </button>
            )}
          </div>

          <label style={{cursor: "pointer"}}>
            <div
              style={isHovering || previewUrl ? {...styles.uploadZone, ...styles.uploadZoneHover} : styles.uploadZone}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" style={styles.preview} />
              ) : (
                <div>
                  <Image size={60} color="#43e97b" style={{margin: "0 auto 1.5rem"}} />
                  <p style={{fontSize: "1.2rem",margin:"0 0 0.5rem 0",color:"#2c5364",fontWeight:600}}>
                    Drop your image here
                  </p>
                  <p style={{fontSize: "1rem",margin:0,color:"#718096"}}>or click to browse</p>
                  <p style={{fontSize:"0.9rem",margin:"0.5rem 0 0 0",color:"#a0aec0"}}>
                    JPG, JPEG, PNG • Max 10MB
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{display: "none"}}
            />
          </label>

          {loading && uploadProgress > 0 && (
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${uploadProgress}%`}} />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selectedImage || loading}
            className="button-hover"
            style={!selectedImage || loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
          >
            {loading ? (
              <>
                <Loader2 size={24} style={{animation:"spin 1s linear infinite"}}/> 
                Analyzing...
              </>
            ) : (
              <>
                <Zap size={24}/> 
                Predict Disease
              </>
            )}
          </button>
          
          {error && (
            <div style={styles.error}>
              <AlertCircle size={22} color="#e53e3e" />
              <span style={{color: "#c53030",fontSize:"1rem",fontWeight:500}}>{error}</span>
            </div>
          )}
        </div>

        {/* ---------- RESULTS CARD ---------- */}
        <div style={styles.card} className="card-hover">
          <h2 style={styles.cardTitle}>
            <Eye size={26}/>
            Prediction Results
          </h2>

          {result ? (
            <div style={{textAlign:"left", padding:"1rem 0"}}>
              
              <div style={{textAlign:"center"}}>
                <CheckCircle2 size={64} color="#38a169"/>
                <p style={{
                  fontWeight:"bold",
                  fontSize:"1.5rem",
                  color:"#2c5364",
                  marginTop:"1rem",
                  lineHeight:1.4
                }}>
                  {result.prediction}
                </p>
              </div>

              {/* ================== NEW DETAILS SHOW ================== */}

              <h3 style={{color:"#2c5364", marginTop:"1.5rem"}}>Plant</h3>
              <p style={{color:"#4a5568"}}>{result.details.Plant}</p>

              <h3 style={{color:"#2c5364", marginTop:"1rem"}}>Disease</h3>
              <p style={{color:"#4a5568"}}>{result.details.Disease}</p>

              <h3 style={{color:"#2c5364", marginTop:"1rem"}}>Root Cause</h3>
              <p style={{color:"#4a5568", lineHeight:1.6}}>
                {result.details["Root Cause"]}
              </p>

              <h3 style={{color:"#2c5364", marginTop:"1rem"}}>Symptoms</h3>
              <ul style={{color:"#4a5568", lineHeight:1.6}}>
                {result.details.Symptoms?.map((sym, idx) => (
                  <li key={idx}>{sym}</li>
                ))}
              </ul>

              <h3 style={{color:"#2c5364", marginTop:"1rem"}}>Treatment</h3>
              <ul style={{color:"#4a5568", lineHeight:1.6}}>
                {result.details.Treatment?.map((treat, idx) => (
                  <li key={idx}>{treat}</li>
                ))}
              </ul>

              {/* ================= END DETAILS ================= */}

            </div>
          ) : (
            <div style={{textAlign:"center",padding:"5rem 0",color:"#cbd5e0"}}>
              <Sparkles size={70} style={{margin:"0 auto 1.5rem",opacity:0.3}} />
              <p style={{fontSize:"1.15rem",margin:0,color:"#a0aec0"}}>
                Upload an image to see results
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ---------- FEATURES ---------- */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
        gap:"1.5rem",
        maxWidth:"1200px",
        margin:"4rem auto 0",
        position:"relative",
        zIndex:1
      }}>
        <div style={styles.featureCard} className="feature-hover">
          <Sparkles size={32} color="#43e97b" style={{marginBottom:"1.2rem"}} />
          <h3 style={{fontSize:"1.2rem",margin:"0 0 0.7rem 0",color:"#2c5364"}}>Deep Learning Model</h3>
          <p style={{color:"#718096",margin:0,fontSize:"1rem",lineHeight:1.6}}>
            Powered by advanced CNN architecture for accurate disease detection
          </p>
        </div>

        <div style={styles.featureCard} className="feature-hover">
          <Zap size={32} color="#43e97b" style={{marginBottom:"1.2rem"}} />
          <h3 style={{fontSize:"1.2rem",margin:"0 0 0.7rem 0",color:"#2c5364"}}>Lightning Fast</h3>
          <p style={{color:"#718096",margin:0,fontSize:"1rem",lineHeight:1.6}}>
            Get instant predictions with our optimized backend infrastructure
          </p>
        </div>

        <div style={styles.featureCard} className="feature-hover">
          <Eye size={32} color="#43e97b" style={{marginBottom:"1.2rem"}} />
          <h3 style={{fontSize:"1.2rem",margin:"0 0 0.7rem 0",color:"#2c5364"}}>High Accuracy</h3>
          <p style={{color:"#718096",margin:0,fontSize:"1rem",lineHeight:1.6}}>
            Industry-leading confidence scores for agricultural diagnostics
          </p>
        </div>
      </div>
    </div>
  );
}
